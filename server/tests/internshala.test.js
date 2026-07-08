import assert from "assert";
import { extractInternshala } from "../services/parser/extractors/internshala.js";
import { normalizeJobData } from "../services/parser/normalizer.js";

/**
 * Runs assertions on Internshala DOM selector extractor and normalizer
 */
export function runInternshalaTests() {
  console.log("⏳ [Test] Running Internshala Extractor Tests...");

  // Mock html representative of Internshala layouts
  const mockHtml = `
    <!DOCTYPE html>
    <html>
      <body>
        <div class="profile_heading">MERN Stack Developer</div>
        <div class="company_name">
          <a class="link_display_like_text">Alpha Web Developers 4.1 ★</a>
        </div>
        <div id="location_names">
          <a class="location_link">Jaipur</a>, 
          <a class="location_link">Work from Home</a>
        </div>
        <div class="stipend_container">
          <span class="stipend">₹ 15,000 - 20,000 /month</span>
        </div>
        <div class="experience">0-2 Years</div>
        <div>
          <span class="round_profile">ReactJS</span>
          <span class="round_profile">Node.js</span>
          <span class="round_profile">MongoDB</span>
        </div>
        <div class="text-container">
          Alpha Web Developers is looking for a developer. Must understand JavaScript and Git.
        </div>
      </body>
    </html>
  `;

  const raw = extractInternshala(mockHtml);

  assert.strictEqual(raw.title, "MERN Stack Developer", "Title should parse from profile_heading");
  assert.ok(raw.company.includes("Alpha Web Developers"), "Company name should parse from link text");
  assert.ok(raw.location.includes("Jaipur"), "Location should parse");
  assert.ok(raw.salary.includes("15,000"), "Stipend should extract");

  console.log("  ✔️ DOM selector scraping assertions passed!");

  // Normalize assertions
  const normalized = normalizeJobData(raw);

  assert.strictEqual(normalized.title, "MERN Stack Developer");
  assert.strictEqual(normalized.company, "Alpha Web Developers", "Company rating details should be cleaned out");
  assert.strictEqual(normalized.location, "Remote", "Should normalize Work from Home to Remote");
  assert.strictEqual(normalized.salary, "₹ 15,000 - 20,000 /month");
  
  // Checks skills combined from tags + description extraction
  assert.ok(normalized.skills.includes("React"), "Skills should normalize ReactJS to React");
  assert.ok(normalized.skills.includes("Node.js"), "Skills should include Node.js");
  assert.ok(normalized.skills.includes("JavaScript"), "Skills should include JavaScript parsed from text description");
  assert.ok(normalized.skills.includes("Git"), "Skills should include Git parsed from text description");

  console.log("  ✔️ Data normalization assertions passed!");

  // Test email and contact number extraction
  const mockHtmlWithContact = `
    <!DOCTYPE html>
    <html>
      <body>
        <div class="profile_heading">MERN Stack Developer</div>
        <div class="company_name">
          <a class="link_display_like_text">Alpha Web Developers 4.1 ★</a>
        </div>
        <div class="experience">0-2 years</div>
        <div class="text-container">
          Send resumes to hr@alphaweb.com or call us at +91-9876543210.
        </div>
      </body>
    </html>
  `;
  const rawWithContact = extractInternshala(mockHtmlWithContact);
  const normalizedWithContact = normalizeJobData(rawWithContact);

  assert.strictEqual(normalizedWithContact.email, "hr@alphaweb.com", "Should extract email from description");
  assert.strictEqual(normalizedWithContact.contact, "+91-9876543210", "Should extract contact phone from description");

  console.log("  ✔️ Email and contact extraction assertions passed!");
  console.log("✅ [Test] Internshala Extractor Tests Passed!\n");
}
