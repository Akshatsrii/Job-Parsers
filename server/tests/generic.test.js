import assert from "assert";
import { extractGeneric } from "../services/parser/extractors/generic.js";

/**
 * Runs assertions for Generic Extractor behaviors
 */
export function runGenericTests() {
  console.log("⏳ [Test] Running Generic Extractor Tests...");

  // Mock HTML containing full Schema.org JobPosting JSON-LD
  const jsonLdHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Scraping Target Title</title>
        <script type="application/ld+json">
          {
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            "title": "Software Developer",
            "description": "<p>Build high-performance web applications using React and Node.js.</p>",
            "hiringOrganization": {
              "@type": "Organization",
              "name": "SuperTech Industries"
            },
            "jobLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Jaipur",
                "addressRegion": "Rajasthan",
                "addressCountry": "India"
              }
            },
            "baseSalary": {
              "@type": "MonetaryAmount",
              "currency": "INR",
              "value": {
                "@type": "QuantitativeValue",
                "minValue": 600000,
                "maxValue": 1000000,
                "unitText": "YEAR"
              }
            }
          }
        </script>
      </head>
      <body>
        <h1>Raw Heading (Ignore this since JSON-LD exists)</h1>
      </body>
    </html>
  `;

  const jsonLdResult = extractGeneric(jsonLdHtml);

  assert.strictEqual(jsonLdResult.title, "Software Developer", "Title should extract from JSON-LD");
  assert.strictEqual(jsonLdResult.company, "SuperTech Industries", "Company name should extract from JSON-LD Organization");
  assert.ok(jsonLdResult.location.includes("Jaipur"), "Location should parse correctly from addressLocality");
  assert.ok(jsonLdResult.salary.includes("600000"), "Salary minimum should be present");
  assert.ok(jsonLdResult.description.includes("React and Node.js"), "HTML tags should be stripped from description");

  console.log("  ✔️ JSON-LD parsing assertions passed!");

  // Mock HTML for OpenGraph tags fallback
  const ogHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="UX Designer at DesignStudio" />
        <meta property="og:site_name" content="DesignStudio" />
        <meta name="description" content="Seeking experienced UI designer skilled in Figma." />
      </head>
      <body>
        <h1>Design Specialist</h1>
      </body>
    </html>
  `;

  const ogResult = extractGeneric(ogHtml);

  assert.strictEqual(ogResult.title, "UX Designer at DesignStudio", "Title should fallback to og:title");
  assert.strictEqual(ogResult.company, "DesignStudio", "Company should fallback to og:site_name");
  assert.strictEqual(ogResult.description, "Seeking experienced UI designer skilled in Figma.", "Description should fallback to meta description");

  console.log("  ✔️ Open Graph / Meta tag fallback assertions passed!");
  console.log("✅ [Test] Generic Extractor Tests Passed!\n");
}
