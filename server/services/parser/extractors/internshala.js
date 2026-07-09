import { load } from "cheerio";
import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes Internshala job and internship pages.
 */
export function extractInternshala(html, url) {
  const $ = load(html);
  const isDetailUrl = url && (
    url.toLowerCase().includes("/detail/") || 
    url.toLowerCase().includes("-detail") ||
    url.toLowerCase().includes("/job/detail/")
  );
  const cards = $(".individual_internship");

  if (!isDetailUrl && cards.length > 0) {
    const jobs = [];
    const isDetailUrl = url && (url.toLowerCase().includes("/detail/") || url.toLowerCase().includes("-detail"));

    cards.each((_, el) => {
      const card = $(el);

      // Extract title
      const title = card.find(".job-internship-name a, .job-title-href, .profile_heading, .heading_4_3, .profile, h3").first().text().trim();
      
      // Extract company name and clean it up
      let company = card.find(".company-name, .company_name a.link_display_like_text, .company_name, a.company_name").first().text().trim();
      if (company) {
        company = company.replace(/\s*\d+(\.\d+)?\s*(?:★|star|rating|ratings|reviews|review|•).*$/i, "");
        company = company.replace(/\s*Actively hiring\s*$/i, "").trim();
      }

      // Extract locations
      const locations = [];
      card.find(".locations a, .locations span, .location_link, #location_names a, .location").each((_, locEl) => {
        const loc = $(locEl).text().trim();
        if (loc && !loc.includes("map-pin") && !locations.includes(loc)) {
          locations.push(loc);
        }
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
      let duration = card.find(".duration, .experience").first().text().trim();
      if (!duration) {
        card.find(".row-1-item").each((_, rowEl) => {
          const item = $(rowEl);
          if (item.find(".ic-16-calendar").length > 0) {
            duration = item.find("span").first().text().trim() || item.text().trim();
          }
        });
      }
      
      // Extract skills
      const skills = [];
      if (isDetailUrl || cards.length === 1) {
        $(".round_tabs_container").first().find(".round_tabs, .job_skill, .round_profile, .skill_tag, .skills_container span").each((_, skillEl) => {
          const val = $(skillEl).text().trim();
          if (val && !skills.includes(val)) skills.push(val);
        });
      } else {
        card.find(".job_skill, .round_tabs, .round_profile, .skill_tag, .skills_container span").each((_, skillEl) => {
          const val = $(skillEl).text().trim();
          if (val && !skills.includes(val)) skills.push(val);
        });
      }

      // Extract short/full description
      let description = "";
      if (isDetailUrl || cards.length === 1) {
        description = $(".text-container").first().text().trim() || card.find(".about_job .text").first().text().trim();
      } else {
        description = card.find(".about_job .text, .text-container, .job_description_heading + div, .detail_view").first().text().trim();
      }

      // Extract apply/details URL
      let detailPath = card.find(".job-title-href, a.job-title-href").first().attr("href") || "";
      if (!detailPath) {
        card.find("a").each((_, aEl) => {
          const href = $(aEl).attr("href");
          if (href && (href.includes("/internship/detail/") || href.includes("/job/detail/"))) {
            detailPath = href;
            return false;
          }
        });
      }

      const applyUrl = isDetailUrl ? url : (detailPath ? (detailPath.startsWith("http") ? detailPath : `https://internshala.com${detailPath}`) : null);

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
          email: "Not Disclosed",
          contact: "Not Disclosed",
          postedDate: postedDate || null,
          applyUrl,
          workMode,
        });
      }
    });

    if (jobs.length > 0) {
      // Check if this is a single detail page
      const isDetailUrl = url && (url.toLowerCase().includes("/detail/") || url.toLowerCase().includes("-detail"));
      if (isDetailUrl || jobs.length === 1) {
        return jobs[0];
      }

      return {
        isJobList: true,
        jobs: jobs,
      };
    }
  }

  return extractUsingSelectors(html, "internshala");
}

