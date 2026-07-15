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
      await page.goto(url, { waitUntil: "load", timeout: 12000 });
      await page.waitForTimeout(1000); // Brief pause for scripts to settle
    } catch (err) {
      console.warn(`⚠️ Playwright page.goto timed out: ${err.message}. Proceeding to extract content anyway...`);
    }
    
    let content = "";
    try {
      const contentPromise = page.content();
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve("TIMEOUT"), 5000));
      const result = await Promise.race([contentPromise, timeoutPromise]);
      if (result === "TIMEOUT") throw new Error("page.content() timed out");
      content = result;
    } catch (contentErr) {
      if (contentErr.message.includes("navigating")) {
        console.warn("🔄 Page is still navigating, waiting another 2 seconds to retrieve content safely...");
        await page.waitForTimeout(2000);
        const contentPromise2 = page.content();
        const timeoutPromise2 = new Promise((resolve) => setTimeout(() => resolve("TIMEOUT"), 5000));
        const result2 = await Promise.race([contentPromise2, timeoutPromise2]);
        if (result2 === "TIMEOUT") throw new Error("page.content() timed out");
        content = result2;
      } else {
        console.warn(`⚠️ Could not retrieve page content: ${contentErr.message}`);
        content = ""; // Fallback to empty content so we don't crash
      }
    }
    
    return content;
  } catch (error) {
    console.error(`❌ Playwright fetch failed for ${url}:`, error.message);
    throw error;
  } finally {
    const closeWithTimeout = (target) => {
      const closePromise = target.close().then(() => "CLOSED").catch(() => "ERROR");
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve("TIMEOUT"), 2000));
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
