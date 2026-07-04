import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes AmbitionBox company pages or job postings.
 */
export function extractAmbitionBox(html) {
  return extractUsingSelectors(html, "ambitionbox");
}
