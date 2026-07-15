import {
  extractSkillsFromText,
  extractSalaryFromText,
  extractExperienceFromText,
  extractEmailsFromText,
  extractContactsFromText
} from "./regex.js";
import { load } from "cheerio";

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
  const originalDescription = description;

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
    if (experience.toLowerCase().includes("starts immediately")) {
      experience = ""; // Discard garbage text
    } else {
      experience = experience.replace(/experience/i, "").trim();
    }
  } 
  
  if (!experience && description) {
    // Scrape from description using regex
    experience = extractExperienceFromText(description);
  }

  // Normalize and parse skills
  let parsedSkills = [];
  if (Array.isArray(raw.skills)) {
    parsedSkills = raw.skills.map((s) => cleanStr(s)).filter(Boolean);
  }

  // Resilient parsing of skills and description text
  if (description) {
    // 1. Check if description has inline "Key skills for the job" section
    const skillsHeaderRegex = /(?:key\s+skills\s+for\s+the\s+job|required\s+skills|skills\s+required)/i;
    const parts = description.split(skillsHeaderRegex);
    if (parts.length > 1) {
      const skillsPart = parts[1];
      const lines = skillsPart
        .split(/[\r\n]+/)
        .map((l) => cleanStr(l))
        .filter(Boolean);

      for (const line of lines) {
        // Strip out read full description or action tags from skills section
        if (
          line.toLowerCase().includes("read full description") ||
          line.toLowerCase().includes("apply direct") ||
          line.toLowerCase().includes("+") ||
          line.toLowerCase().includes("more")
        ) {
          continue;
        }
        if (line.length > 1 && line.length < 35 && !line.includes("jobs)")) {
          parsedSkills.push(line);
        }
      }
    }

    // 2. Fallback: extract technical keywords from description text to enrich the skills list
    const skillsFromDesc = extractSkillsFromText(description);
    parsedSkills = [...parsedSkills, ...skillsFromDesc];

    // 3. Clean job description by truncating it at the "Read full description" or "Key skills" block
    const truncateRegex = /(?:read\s+full\s+description|key\s+skills\s+for\s+the\s+job|required\s+skills)/i;
    description = description.split(truncateRegex)[0].trim();
  }

  // Clean and unify skill casing/names (e.g. Nodejs -> Node.js)
  parsedSkills = parsedSkills
    .map((s) => cleanStr(s))
    .filter((s) => {
      if (!s) return false;
      const lower = s.toLowerCase();
      // Filter out search category junk (e.g. "TCS (4.5k jobs)", "Sales (84.3k jobs)", "Bengaluru (1.3L jobs)")
      if (lower.includes("jobs)") || lower.includes("job)") || s.includes("(") || s.includes(")")) {
        return false;
      }
      // Filter out generic counts and tags
      if (lower.startsWith("+") && lower.endsWith("more")) {
        return false;
      }
      if (
        lower === "read full description" ||
        lower === "detailed job description" ||
        lower === "key skills for the job" ||
        lower === "posted just now" ||
        lower === "job description"
      ) {
        return false;
      }
      return s.length > 1 && s.length < 35; // reasonable length limit for a skill name
    })
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

  // Extract email and contact info
  // Initialize email and contact, treating placeholder values as empty
  let email = raw.email && raw.email !== "Not Disclosed" && raw.email.toLowerCase() !== "complaints@internshala.com" ? raw.email : "";
  let contact = raw.contact && raw.contact !== "Not Disclosed" ? raw.contact : "";

  // 1. Try to extract from the full original job description text
  if (originalDescription) {
    if (!email) {
      const emailMatches = extractEmailsFromText(originalDescription).filter(e => e.toLowerCase() !== "complaints@internshala.com");
      if (emailMatches.length > 0) {
        email = emailMatches.join(", ");
      }
    }
    if (!contact) {
      const contactMatches = extractContactsFromText(originalDescription);
      if (contactMatches.length > 0) {
        contact = contactMatches.join(", ");
      }
    }
  }

  // 2. Fallback to scanning overall visible HTML text if not found in the description text
  if (raw.html && (!email || !contact)) {
    try {
      const $ = load(raw.html);
      $("script, style, iframe, noscript, header, footer, nav").remove();
      const visibleText = $("body").text();
      
      if (!email) {
        const emailMatches = extractEmailsFromText(visibleText).filter(e => e.toLowerCase() !== "complaints@internshala.com");
        if (emailMatches.length > 0) {
          email = emailMatches.join(", ");
        }
      }
      if (!contact) {
        const contactMatches = extractContactsFromText(visibleText);
        if (contactMatches.length > 0) {
          contact = contactMatches.join(", ");
        }
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse fallback html for email/contacts:", e.message);
    }
  }

  // Ensure fallback values
  email = email || "Not Disclosed";
  contact = contact || "Not Disclosed";

  // Retain extra fields from raw data
  const postedDate = raw.postedDate || null;
  const applyUrl = raw.applyUrl || null;
  const workMode = raw.workMode || "On-site";
  const isJobList = raw.isJobList || false;
  const isCompanyList = raw.isCompanyList || false;

  return {
    title: title || "Job Title Not Found",
    company: company || "Company Name Not Found",
    location: location || "Not Disclosed",
    salary: salary || "Not Disclosed",
    experience: experience || "Not Specified",
    skills: parsedSkills,
    description: description || "No Description Provided",
    email,
    contact,
    postedDate,
    applyUrl,
    workMode,
    ...(isJobList && { isJobList, jobs: raw.jobs }),
    ...(isCompanyList && { isCompanyList, companies: raw.companies })
  };
}
