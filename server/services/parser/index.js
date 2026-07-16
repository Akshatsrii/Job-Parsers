import { detectPlatform } from "./detector.js";
import { getExtractor } from "./parserFactory.js";
import { fetchHtml } from "./fetcher.js";
import { fetchDynamicHtml } from "./browserFetcher.js";
import { cleanHtml } from "./cleaner.js";
import { normalizeJobData } from "./normalizer.js";
import { validateJobData } from "./validator.js";

/**
 * 3-Level Job Parser Coordinator
 * Level 1: Axios + Cheerio (fast, static HTML)
 * Level 2: Playwright (JavaScript dynamic render)
 * Level 3: Generic fallback (Schema.org JSON-LD & meta tags extraction on whatever HTML we got)
 */
export async function parseJob(url) {
  const platform = detectPlatform(url);
  const extractor = getExtractor(platform);

  console.log(`🤖 [ParserCoordinator] Starting extraction: URL=${url}, Platform=${platform}`);

  let html = "";
  let rawData = {};
  let lastError = null;
  let requiresBrowser = ["linkedin", "indeed", "internshala"].includes(platform);
  if (platform === "internshala" && url) {
    const isDetailUrl = url.toLowerCase().includes("/detail/") || url.toLowerCase().includes("-detail");
    if (isDetailUrl) {
      requiresBrowser = false;
    }
  }

  if (!requiresBrowser) {
    // --- Level 1: Static Axios + Cheerio Fetch ---
    try {
      console.log("📡 [Level 1] Fetching static HTML with Axios...");
      const rawHtml = await fetchHtml(url);
      html = cleanHtml(rawHtml);

      console.log("🔍 [Level 1] Executing extractor...");
      rawData = extractor(html, url) || {};
      rawData.html = html;

      // If it is a job list or company list, return immediately
      if (rawData && (rawData.isJobList || rawData.isCompanyList)) {
        console.log("✅ [Level 1] List extraction successful!");
        return rawData;
      }

      // If we got high-quality matching data, immediately return
      if (rawData && rawData.title && rawData.company) {
        console.log("✅ [Level 1] Static extraction successful!");
        const normalized = normalizeJobData(rawData);
        validateJobData(normalized);
        return normalized;
      }
      console.warn("⚠️ [Level 1] Static extraction gave insufficient data. Falling back to Level 2...");
    } catch (err) {
      console.warn(`⚠️ [Level 1] Static parse failed: ${err.message}`);
      lastError = err;
    }
  }

  // --- Level 2: Playwright Browser Fetch ---
  if (requiresBrowser || platform !== "ambitionbox") {
    try {
      console.log("🌐 [Level 2] Launching headless browser with Playwright...");
      const rawHtml = await fetchDynamicHtml(url);
      html = cleanHtml(rawHtml);

      console.log("🔍 [Level 2] Executing extractor...");
      const dynamicData = extractor(html, url);
      
      // Merge results from dynamic rendering
      rawData = {
        ...rawData,
        ...dynamicData,
        html,
      };

      // If it is a job list or company list, return immediately
      if (rawData && (rawData.isJobList || rawData.isCompanyList)) {
        console.log("✅ [Level 2] List extraction successful!");
        return rawData;
      }

      if (rawData.title || rawData.company) {
        console.log("✅ [Level 2] Dynamic extraction successful!");
        const normalized = normalizeJobData(rawData);
        validateJobData(normalized);
        return normalized;
      }
    } catch (err) {
      console.error(`❌ [Level 2] Browser loading failed: ${err.message}`);
      lastError = err;
    }
  } else {
    console.log("⏭️ [Level 2] Skipping Playwright fetch for Ambitionbox to prevent Cloudflare timeout hanging.");
  }

  // --- Level 3: Generic Meta / JSON-LD Schema Fallback ---
  try {
    console.log("🩹 [Level 3] Running generic fallback parser on cached HTML...");
    if (html) {
      const genericExtractor = getExtractor("generic");
      const fallbackData = genericExtractor(html);

      // Merge and choose fallback properties if specific extractor left gaps
      const mergedData = {
        title: rawData.title || fallbackData.title,
        company: rawData.company || fallbackData.company,
        location: rawData.location || fallbackData.location,
        salary: rawData.salary || fallbackData.salary,
        experience: rawData.experience || fallbackData.experience,
        skills: (rawData.skills && rawData.skills.length > 0) ? rawData.skills : fallbackData.skills,
        description: rawData.description || fallbackData.description,
        html: html,
      };

      const normalized = normalizeJobData(mergedData);
      validateJobData(normalized);
      console.log("✅ [Level 3] Extraction recovered using generic parsing!");
      return normalized;
    }
  } catch (err) {
    console.error(`❌ [Level 3] Fallback parser failed: ${err.message}`);
    lastError = err;
  }

  // If all levels fail, throw a detailed error
  if (lastError && (
    lastError.message.includes("Playwright browser instance unavailable") ||
    lastError.message.includes("timeout of") ||
    lastError.message.includes("status code 403") ||
    lastError.message.includes("status code 503") ||
    lastError.message.includes("Failed to fetch page content")
  )) {
    throw new Error(
      "This request timed out or was blocked by Cloudflare bot protection. Hosting servers (like Render or AWS) are often blocked by job boards. Please run the app locally, configure a proxy, or paste the job description/HTML directly."
    );
  }

  throw new Error(
    lastError
      ? `Parsing failed: ${lastError.message}`
      : "Parsing failed. Could not extract job details from the provided URL."
  );
}
