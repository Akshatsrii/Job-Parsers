import { load } from "cheerio";
import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes Naukri job detail pages.
 * Tries to extract React hydration state from scripting, falling back to CSS selectors.
 */
export function extractNaukri(html) {
  const $ = load(html);
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
