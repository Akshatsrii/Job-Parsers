import { chromium } from "playwright";

let browserInstance = null;

export async function getBrowser() {
  if (browserInstance) return browserInstance;
  try {
    browserInstance = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-blink-features=AutomationControlled"],
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
    
    // Go to URL and wait until the DOM is loaded
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(1000);
    } catch (err) {
      console.warn(`⚠️ Playwright page.goto timed out: ${err.message}. Proceeding to extract content anyway...`);
    }
    
    const content = await page.content();
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
