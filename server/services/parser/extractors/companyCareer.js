import { extractGeneric } from "./generic.js";

/**
 * Scrapes company career websites (e.g. Greenhouse, Lever, Workday, etc.).
 * Mostly utilizes clean, standardized JSON-LD schema objects embedded on these pages.
 */
export function extractCompanyCareer(html) {
  return extractGeneric(html);
}
