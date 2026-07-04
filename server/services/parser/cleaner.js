import { load } from "cheerio";

/**
 * Remove heavy tags to optimize selector querying and parsing.
 * Preserves JSON-LD scripts and relevant meta tags.
 */
export function cleanHtml(html) {
  if (!html) return "";

  try {
    const $ = load(html);

    // Remove scripts except application/ld+json and __NEXT_DATA__
    $("script").each((_, el) => {
      const type = $(el).attr("type");
      const id = $(el).attr("id");
      if (type !== "application/ld+json" && id !== "__NEXT_DATA__") {
        $(el).remove();
      }
    });

    // Remove styling and other non-text structures
    $("style").remove();
    $("svg").remove();
    $("iframe").remove();
    $("noscript").remove();
    $("link").remove();
    
    // Remove complex graphics and symbols to keep text parsing lighter
    $("picture, figure").remove();

    return $.html();
  } catch (err) {
    console.error("⚠️ HTML clean warning:", err.message);
    return html; // Fallback to raw html in case load fails
  }
}
