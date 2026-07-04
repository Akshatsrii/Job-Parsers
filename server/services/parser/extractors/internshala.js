import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes Internshala job and internship pages.
 */
export function extractInternshala(html) {
  return extractUsingSelectors(html, "internshala");
}
