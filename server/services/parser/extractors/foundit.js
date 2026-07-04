import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes Foundit.in (formerly Monster India) job pages.
 */
export function extractFoundit(html) {
  return extractUsingSelectors(html, "foundit");
}
