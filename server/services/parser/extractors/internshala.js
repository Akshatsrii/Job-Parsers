import { load } from "cheerio";
import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes Internshala job and internship pages.
 */
export function extractInternshala(html) {
  const $ = load(html);
  const cards = $(".individual_internship");

  if (cards.length > 0) {
    const jobs = [];
    cards.each((_, el) => {
      const card = $(el);

      // Extract title
      const title = card.find(".profile_heading, .heading_4_3, .profile, h3").first().text().trim();
      
      // Extract company name and clean it up
      let company = card.find(".company_name a.link_display_like_text, .company_name, a.company_name").first().text().trim();
      if (company) {
        company = company.replace(/\s*\d+(\.\d+)?\s*(?:★|star|rating|ratings|reviews|review|•).*$/i, "");
        company = company.replace(/\s*Actively hiring\s*$/i, "").trim();
      }

      // Extract locations
      const locations = [];
      card.find(".location_link, #location_names a, .location").each((_, locEl) => {
        const loc = $(locEl).text().trim();
        if (loc) locations.push(loc);
      });
      if (locations.length === 0) {
        const locText = card.find(".location").first().text().trim() || card.find("#location_names").first().text().trim();
        if (locText) {
          locations.push(locText);
        }
      }

      // Extract stipend/salary
      const salary = card.find(".stipend, .salary, .stipend_amount").first().text().trim();

      // Extract duration or experience
      const duration = card.find(".duration, .experience").first().text().trim();
      
      // Extract skills
      const skills = [];
      card.find(".round_profile, .skill_tag, .skills_container span").each((_, skillEl) => {
        const val = $(skillEl).text().trim();
        if (val) skills.push(val);
      });

      // Extract short description
      const description = card.find(".text-container, .job_description_heading + div, .detail_view").first().text().trim();

      // Extract apply/details URL
      let detailPath = "";
      card.find("a").each((_, aEl) => {
        const href = $(aEl).attr("href");
        if (href && (href.includes("/internship/detail/") || href.includes("/job/detail/"))) {
          detailPath = href;
          return false;
        }
      });
      if (!detailPath) {
        detailPath = card.find("a.view_detail_button").attr("href") || "";
      }

      const applyUrl = detailPath ? (detailPath.startsWith("http") ? detailPath : `https://internshala.com${detailPath}`) : null;

      // Extract posted date
      const postedDate = card.find(".status-inactive, .posted_by, .status-container, .status-active").first().text().trim();

      // Determine workMode
      let workMode = "On-site";
      const locStr = locations.join(", ").toLowerCase();
      if (locStr.includes("remote") || locStr.includes("work from home") || locStr.includes("wfh")) {
        workMode = "Remote";
      }

      if (title && company) {
        jobs.push({
          title,
          company,
          location: locations.join(", ") || "Not Disclosed",
          salary: salary || "Not Disclosed",
          experience: duration || "Not Specified",
          skills,
          description: description || "No Description Provided",
          postedDate: postedDate || null,
          applyUrl,
          workMode,
        });
      }
    });

    if (jobs.length > 0) {
      return {
        isJobList: true,
        jobs: jobs,
      };
    }
  }

  return extractUsingSelectors(html, "internshala");
}

