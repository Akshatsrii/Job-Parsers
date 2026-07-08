import { load } from "cheerio";
import selectors from "./selectors.js";

/**
 * Extracts elements from HTML using a set of pre-defined selectors for a given platform.
 */
export function extractUsingSelectors(html, platform) {
  const $ = load(html);
  const siteSelectors = selectors[platform];
  
  if (!siteSelectors) {
    return {};
  }

  const result = {
    title: "",
    company: "",
    location: "",
    salary: "",
    experience: "",
    skills: [],
    description: "",
  };

  // Extract simple string fields
  for (const field of ["title", "company", "location", "salary", "experience", "description"]) {
    const list = siteSelectors[field];
    if (list) {
      for (const sel of list) {
        if (field === "description") {
          const texts = [];
          $(sel).each((_, el) => {
            const txt = $(el).text().trim();
            if (txt) texts.push(txt);
          });
          if (texts.length > 0) {
            result[field] = texts.join("\n\n");
            break;
          }
        } else {
          const val = $(sel).first().text().trim();
          if (val) {
            result[field] = val;
            break;
          }
        }
      }
    }
  }

  // Extract arrays (e.g. skills)
  const skillsSelectors = siteSelectors.skills;
  if (skillsSelectors) {
    const skillsList = new Set();
    for (const sel of skillsSelectors) {
      $(sel).each((_, el) => {
        const val = $(el).text().trim();
        // Remove commas or excessive text from skill tags
        if (val && val.length > 1 && val.length < 30) {
          skillsList.add(val.replace(/,$/, "").trim());
        }
      });
    }
    result.skills = Array.from(skillsList);
  }

  return result;
}
