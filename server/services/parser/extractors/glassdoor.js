import { extractUsingSelectors } from "../utils.js";
import { extractGeneric } from "./generic.js";

/**
 * Scrapes Glassdoor job detail listings by combining JSON-LD metadata and DOM selectors.
 */
export function extractGlassdoor(html) {
  const genericData = extractGeneric(html);
  const selectorData = extractUsingSelectors(html, "glassdoor");

  return {
    title: genericData.title || selectorData.title,
    company: genericData.company || selectorData.company,
    location: genericData.location || selectorData.location,
    salary: genericData.salary || selectorData.salary,
    experience: genericData.experience || selectorData.experience,
    skills: (genericData.skills && genericData.skills.length > 0) ? genericData.skills : selectorData.skills,
    description: genericData.description || selectorData.description,
  };
}
