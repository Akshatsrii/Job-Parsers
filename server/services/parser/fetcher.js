import { gotScraping } from "got-scraping";
import { PROXY_URL } from "../../config/env.js";

/**
 * Fetch static HTML content using got-scraping
 * got-scraping spoofs the TLS/JA3 fingerprint to look like a real Chrome browser,
 * bypassing Cloudflare's bot detection which fingerprints Node.js TLS connections.
 */
export async function fetchHtml(url) {
  try {
    const options = {
      url,
      headerGeneratorOptions: {
        browsers: [{ name: "chrome", minVersion: 120 }],
        devices: ["desktop"],
        locales: ["en-US"],
        operatingSystems: ["windows"],
      },
      timeout: { request: 30000 },
      followRedirect: true,
      https: { rejectUnauthorized: false },
    };

    // Configure proxy if set
    if (PROXY_URL) {
      options.proxyUrl = PROXY_URL;
      console.log(`📡 [Fetcher] Using proxy: ${PROXY_URL}`);
    }

    const response = await gotScraping(options);
    return response.body;
  } catch (error) {
    console.error(`❌ Static fetch failed for ${url}:`, error.message);
    throw new Error(`Failed to fetch page content: ${error.message}`);
  }
}
