import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes Indeed job details.
 */
export function extractIndeed(html) {
  return extractUsingSelectors(html, "indeed");
}
