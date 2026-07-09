import { load } from "cheerio";
import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes Naukri job detail pages.
 * Tries to extract React hydration state from scripting, falling back to CSS selectors.
 */
export function extractNaukri(html) {
  const $ = load(html);
  
  // Check if it's a job list page
  const cards = $(".cust-job-tuple, .srp-jobtuple-wrapper");
  if (cards.length > 0) {
    const jobs = [];
    cards.each((_, el) => {
      const card = $(el);
      
      // Extract title and details link
      const titleEl = card.find("a.title").first();
      const title = titleEl.text().trim();
      let applyUrl = titleEl.attr("href") || "";
      if (applyUrl && !applyUrl.startsWith("http")) {
        applyUrl = `https://www.naukri.com${applyUrl}`;
      }
      
      // Extract company
      const company = card.find(".comp-name").first().text().trim();
      
      // Extract experience
      const experience = card.find(".exp-wrap").first().text().trim();
      
      // Extract location
      const location = card.find(".loc-wrap").first().text().trim();
      
      // Extract salary
      const salary = card.find(".sal-wrap").first().text().trim();
      
      // Extract skills
      const skills = [];
      card.find(".tags-gt li, .tags-gt span, .tag-li").each((_, tagEl) => {
        const val = $(tagEl).text().trim();
        if (val) skills.push(val);
      });
      
      // Extract posted date
      const postedDate = card.find(".job-post-day, .posted").first().text().trim() || null;
      
      // Extract description snippet (Naukri SRP has snippet inside row4 / .job-desc)
      const description = card.find(".job-desc, .row4").first().text().trim();
      
      // Determine work mode
      let workMode = "On-site";
      const locStr = location.toLowerCase();
      if (locStr.includes("remote") || locStr.includes("work from home") || locStr.includes("wfh")) {
        workMode = "Remote";
      } else if (locStr.includes("hybrid")) {
        workMode = "Hybrid";
      }
      
      if (title && company) {
        jobs.push({
          title,
          company,
          location: location || "Not Disclosed",
          salary: salary || "Not Disclosed",
          experience: experience || "Not Specified",
          skills,
          description: description || "No Description Provided. Click 'View Details' to fetch.",
          email: "Not Disclosed",
          contact: "Not Disclosed",
          postedDate,
          applyUrl,
          workMode,
        });
      }
    });
    
    if (jobs.length > 0) {
      return {
        isJobList: true,
        jobs,
      };
    }
  }

  let stateData = null;

  // Search for script tags containing window.initialState
  $("script").each((_, el) => {
    const rawText = $(el).html() || "";
    if (rawText.includes("window.initialState") || rawText.includes("initialState =")) {
      try {
        const match = rawText.match(/initialState\s*=\s*({.+?});?/s);
        if (match) {
          const parsed = JSON.parse(match[1]);
          const jd = parsed.jobDetails || {};
          
          stateData = {
            title: jd.title || "",
            company: jd.companyName || "",
            location: jd.locations && jd.locations.map((l) => l.label).join(", "),
            salary: jd.salary || "",
            experience: jd.experience || "",
            skills: jd.keySkills && jd.keySkills.map((s) => s.label),
            description: jd.jobDescription || "",
          };
        }
      } catch (err) {
        console.error("⚠️ Failed to parse Naukri hydration script:", err.message);
      }
    }
  });

  const selectorData = extractUsingSelectors(html, "naukri");

  if (stateData) {
    return {
      title: stateData.title || selectorData.title,
      company: stateData.company || selectorData.company,
      location: stateData.location || selectorData.location,
      salary: stateData.salary || selectorData.salary,
      experience: stateData.experience || selectorData.experience,
      skills: (stateData.skills && stateData.skills.length > 0) ? stateData.skills : selectorData.skills,
      description: stateData.description || selectorData.description,
    };
  }

  return selectorData;
}
