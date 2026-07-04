import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes LinkedIn job posting pages.
 */
export function extractLinkedIn(html) {
  return extractUsingSelectors(html, "linkedin");
}
