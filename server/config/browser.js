import { chromium } from "playwright";

let browserInstance = null;

export async function getBrowser() {
  if (browserInstance) return browserInstance;
  try {
    browserInstance = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-blink-features=AutomationControlled", "--disable-http2"],
    });
    return browserInstance;
  } catch (error) {
    console.error("❌ Failed to launch Playwright browser:", error.message);
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
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 800 },
    });
    page = await context.newPage();
    
    // Go to URL and wait until page is fully loaded to prevent navigation conflict
    try {
      await page.goto(url, { waitUntil: "load", timeout: 20000 });
      await page.waitForTimeout(2000); // Brief pause for scripts to settle
    } catch (err) {
      console.warn(`⚠️ Playwright page.goto timed out: ${err.message}. Proceeding to extract content anyway...`);
    }
    
    let content = "";
    try {
      content = await page.content();
    } catch (contentErr) {
      if (contentErr.message.includes("navigating")) {
        console.warn("🔄 Page is still navigating, waiting another 3 seconds to retrieve content safely...");
        await page.waitForTimeout(3000);
        content = await page.content();
      } else {
        throw contentErr;
      }
    }
    
    return content;
  } catch (error) {
    console.error(`❌ Playwright fetch failed for ${url}:`, error.message);
    throw error;
  } finally {
    if (page) await page.close();
    if (context) await context.close();
  }
}

export async function closeBrowser() {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}
