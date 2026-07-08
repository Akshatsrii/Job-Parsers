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

  // 1. Determine if this platform is JS-heavy and strictly requires Playwright
  const requiresBrowser = ["linkedin", "indeed"].includes(platform);

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
  if (lastError && lastError.message.includes("Playwright browser instance unavailable")) {
    throw new Error(
      "This page is protected by Cloudflare bot protection. Since the headless browser is not installed on the hosted server, we cannot scrape it. Please run the app locally with Playwright installed, or paste the job description/HTML directly."
    );
  }

  throw new Error(
    lastError
      ? `Parsing failed: ${lastError.message}`
      : "Parsing failed. Could not extract job details from the provided URL."
  );
}
