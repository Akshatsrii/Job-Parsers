import { load } from "cheerio";
import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes Indeed job details or listing pages.
 */
export function extractIndeed(html) {
  const $ = load(html);
  
  // Check if it's a job list page
  const cards = $(".job_seen_beacon, td.resultContent, .tapItem");
  if (cards.length > 0) {
    const jobs = [];
    cards.each((_, el) => {
      const card = $(el);
      
      // Extract title and details link
      const titleEl = card.find("h2.jobTitle a, a.jcs-JobTitle, a[class*='JobTitle']").first();
      const title = titleEl.text().trim();
      let applyUrl = titleEl.attr("href") || "";
      if (applyUrl && !applyUrl.startsWith("http")) {
        applyUrl = `https://in.indeed.com${applyUrl}`;
      }
      
      // Extract company
      const company = card.find("[data-testid='company-name'], .companyName, [class*='company-name']").first().text().trim();
      
      // Extract location
      const location = card.find("[data-testid='text-location'], .companyLocation, [class*='location']").first().text().trim();
      
      // Extract salary
      const salary = card.find(".salary-snippet-container, .salaryOnly, [class*='salary']").first().text().trim();
      
      // Extract description snippet
      const description = card.find(".job-snippet, [class*='snippet']").first().text().trim();
      
      // Extract posted date
      const postedDate = card.find("span.date, [class*='date']").first().text().trim() || null;
      
      // Determine work mode
      let workMode = "On-site";
      const locStr = location.toLowerCase();
      if (locStr.includes("remote") || locStr.includes("work from home") || locStr.includes("wfh")) {
        workMode = "Remote";
      } else if (locStr.includes("hybrid")) {
        workMode = "Hybrid";
      }
      
      if (title && company) {
        jobs.push({
          title,
          company,
          location: location || "Not Disclosed",
          salary: salary || "Not Disclosed",
          experience: "Not Specified",
          skills: [],
          description: description || "No Description Provided. Click 'View Details' to fetch.",
          email: "Not Disclosed",
          contact: "Not Disclosed",
          postedDate,
          applyUrl,
          workMode,
        });
      }
    });
    
    if (jobs.length > 0) {
      return {
        isJobList: true,
        jobs,
      };
    }
  }

  return extractUsingSelectors(html, "indeed");
}
