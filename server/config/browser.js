import { chromium as playwrightChromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { PROXY_URL } from "./env.js";

// Apply stealth plugin — patches 30+ bot-detection vectors including:
// - navigator.webdriver = false
// - navigator.plugins (fake realistic plugins)
// - WebGL renderer spoofing
// - Chrome runtime object injection
// - Permission API spoofing
// - Hairline feature detection bypass
playwrightChromium.use(StealthPlugin());

let browserInstance = null;

export async function getBrowser() {
  if (browserInstance) return browserInstance;
  try {
    const launchOptions = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
        "--disable-http2",
        "--disable-features=IsolateOrigins,site-per-process",
        "--window-size=1280,800",
      ],
    };

    if (PROXY_URL) {
      launchOptions.proxy = { server: PROXY_URL };
      console.log(`🌐 [Playwright] Configured browser proxy server: ${PROXY_URL}`);
    }

    browserInstance = await playwrightChromium.launch(launchOptions);
    console.log("🥷 [Playwright] Stealth browser launched successfully.");
    return browserInstance;
  } catch (error) {
    console.error("❌ Failed to launch Playwright stealth browser:", error.message);
    throw new Error("Playwright browser instance unavailable. Make sure you run 'npx playwright install chromium'");
  }
}

export async function fetchWithBrowser(url) {
  let browser = null;
  let context = null;
  let page = null;
  try {
    browser = await getBrowser();
    context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 800 },
      locale: "en-US",
      timezoneId: "America/New_York",
      extraHTTPHeaders: {
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });
    page = await context.newPage();

    // Go to URL and wait until page is fully loaded
    try {
      await page.goto(url, { waitUntil: "load", timeout: 20000 });
      await page.waitForTimeout(2000); // Brief pause for JS scripts to settle
    } catch (err) {
      console.warn(`⚠️ Playwright page.goto timed out: ${err.message}. Proceeding to extract content anyway...`);
    }

    let content = "";
    try {
      const contentPromise = page.content();
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve("TIMEOUT"), 8000));
      const result = await Promise.race([contentPromise, timeoutPromise]);
      if (result === "TIMEOUT") throw new Error("page.content() timed out");
      content = result;
    } catch (contentErr) {
      if (contentErr.message.includes("navigating")) {
        console.warn("🔄 Page is still navigating, waiting another 2 seconds to retrieve content safely...");
        await page.waitForTimeout(2000);
        const contentPromise2 = page.content();
        const timeoutPromise2 = new Promise((resolve) => setTimeout(() => resolve("TIMEOUT"), 8000));
        const result2 = await Promise.race([contentPromise2, timeoutPromise2]);
        if (result2 === "TIMEOUT") throw new Error("page.content() timed out");
        content = result2;
      } else {
        console.warn(`⚠️ Could not retrieve page content: ${contentErr.message}`);
        content = "";
      }
    }

    return content;
  } catch (error) {
    console.error(`❌ Playwright stealth fetch failed for ${url}:`, error.message);
    throw error;
  } finally {
    const closeWithTimeout = (target) => {
      const closePromise = target.close().then(() => "CLOSED").catch(() => "ERROR");
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve("TIMEOUT"), 2000));
      return Promise.race([closePromise, timeoutPromise]);
    };
    if (page) await closeWithTimeout(page);
    if (context) await closeWithTimeout(context);
  }
}

export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
