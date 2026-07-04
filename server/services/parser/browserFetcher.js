import { fetchWithBrowser } from "../../config/browser.js";

/**
 * Fetch dynamic page content using Playwright browser
 */
export async function fetchDynamicHtml(url) {
  try {
    const html = await fetchWithBrowser(url);
    return html;
  } catch (error) {
    console.error(`❌ Dynamic browser fetch failed for ${url}:`, error.message);
    throw new Error(`Failed to fetch dynamic page content: ${error.message}`);
  }
}
