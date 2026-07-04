import {
  extractSkillsFromText,
  extractSalaryFromText,
  extractExperienceFromText
} from "./regex.js";

/**
 * Normalizes scraped job data to match a consistent JSON schema
 */
export function normalizeJobData(raw) {
  const cleanStr = (s) => (s ? s.replace(/\s+/g, " ").trim() : "");

  let title = cleanStr(raw.title);
  let company = cleanStr(raw.company);
  let location = cleanStr(raw.location);
  let salary = cleanStr(raw.salary);
  let experience = cleanStr(raw.experience);
  let description = raw.description ? raw.description.trim() : "";

  // Clean company name from rating/reviews trailing noise (e.g. "TCS 3.8 Reviews" or "Wipro3.9")
  if (company) {
    // Split by newlines, keep first line
    company = company.split(/[\r\n]+/)[0].trim();
    // Remove "4.2 Ratings" or "3.9 ★" or "4.5 Reviews" or similar
    company = company.replace(/\s*\d+(\.\d+)?\s*(?:★|star|rating|ratings|reviews|review|•).*$/i, "");
    // Remove standalone rating numbers like " 3.9 " at the end
    company = company.replace(/\s+\d\.\d\s*$/g, "");
    company = cleanStr(company);
  }

  // Normalize remote locations
  if (location) {
    const locLower = location.toLowerCase();
    if (locLower.includes("remote") || locLower.includes("work from home") || locLower.includes("wfh")) {
      location = "Remote";
    } else {
      // Split by commas, keep up to 3 location segments (e.g., City, State, Country)
      location = location
        .split(",")
        .map((p) => cleanStr(p))
        .filter(Boolean)
        .slice(0, 3)
        .join(", ");
    }
  }

  // Normalize salary
  if (salary) {
    // Remove noise like "stipend" label if it's mixed in
    salary = salary.replace(/stipend/i, "").trim();
  } else if (description) {
    // If not found in selectors, scrape from description using regex
    salary = extractSalaryFromText(description);
  }

  // Normalize experience
  if (experience) {
    experience = experience.replace(/experience/i, "").trim();
  } else if (description) {
    // Scrape from description using regex
    experience = extractExperienceFromText(description);
  }

  // Normalize and parse skills
  let parsedSkills = [];
  if (Array.isArray(raw.skills)) {
    parsedSkills = raw.skills.map((s) => cleanStr(s)).filter(Boolean);
  }

  // Fallback: extract technical keywords from description text to enrich the skills list
  if (description) {
    const skillsFromDesc = extractSkillsFromText(description);
    parsedSkills = [...new Set([...parsedSkills, ...skillsFromDesc])];
  }

  // Clean and unify skill casing/names (e.g. Nodejs -> Node.js)
  parsedSkills = parsedSkills
    .map((s) => {
      const lower = s.toLowerCase();
      if (lower === "nodejs" || lower === "node.js") return "Node.js";
      if (lower === "reactjs" || lower === "react.js") return "React";
      if (lower === "mongodb") return "MongoDB";
      if (lower === "typescript") return "TypeScript";
      if (lower === "javascript" || lower === "js") return "JavaScript";
      if (lower === "html5") return "HTML";
      if (lower === "css3") return "CSS";
      if (lower === "golang") return "Go";
      if (lower === "aws") return "AWS";
      if (lower === "gcp") return "GCP";
      
      // Title-case by default
      return s.charAt(0).toUpperCase() + s.slice(1);
    })
    .filter((s, idx, self) => s && self.indexOf(s) === idx); // unique list

  return {
    title: title || "Job Title Not Found",
    company: company || "Company Name Not Found",
    location: location || "Not Disclosed",
    salary: salary || "Not Disclosed",
    experience: experience || "Not Specified",
    skills: parsedSkills,
    description: description || "No Description Provided",
  };
}
