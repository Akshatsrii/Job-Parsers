import { load } from "cheerio";
import { extractUsingSelectors } from "../utils.js";

/**
 * Convert HTML string to clean plain text (strips tags, decodes entities)
 */
function htmlToText(html) {
  if (!html) return "";
  const $ = load(html);
  // Replace block elements with newlines for readability
  $("p, li, br, h1, h2, h3, h4").each((_, el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === "li") {
      $(el).prepend("• ");
    }
    $(el).after("\n");
  });
  return $.root().text().replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Scrapes AmbitionBox company pages or job postings.
 */
export function extractAmbitionBox(html, url) {
  const $ = load(html);

  // Check if it's a company list page (div.company-content-wrapper cards - old layout)
  const companyCardsOld = $("div.company-content-wrapper");
  if (companyCardsOld.length > 0) {
    const companies = [];
    companyCardsOld.each((_, el) => {
      const card = $(el);
      const name = card.find("h2").first().text().trim() || "N/A";
      const rating = card.find("p.rating, .rating").first().text().trim() || "N/A";
      const reviews = card.find("a.review-count, .review-count").first().text().trim() || "N/A";
      const info = card.find("p.infoEntity, .infoEntity");

      companies.push({
        name: name,
        rating: rating,
        reviews: reviews,
        companyType: info.length > 0 ? $(info[0]).text().trim() : "N/A",
        headquarters: info.length > 1 ? $(info[1]).text().trim() : "N/A",
        companyAge: info.length > 2 ? $(info[2]).text().trim() : "N/A",
        noOfEmployee: info.length > 3 ? $(info[3]).text().trim() : "N/A",
      });
    });

    return {
      isCompanyList: true,
      companies: companies,
    };
  }

  // Check if it's a company list page (div.companyCardWrapper cards - new layout)
  const companyCardsNew = $(".companyCardWrapper");
  if (companyCardsNew.length > 0) {
    const companies = [];
    companyCardsNew.each((_, el) => {
      const card = $(el);
      const name = card.find(".companyCardWrapper__companyName").first().text().trim() || "N/A";
      const rating = card.find(".companyCardWrapper__companyRating").first().text().trim() || "N/A";
      
      let reviews = card.find(".companyCardWrapper__companyRatingCount").first().text().trim() || "N/A";
      reviews = reviews.replace(/[()]/g, "").trim();
      if (reviews && !reviews.toLowerCase().includes("reviews")) {
        reviews = `${reviews} Reviews`;
      }

      const interlinking = card.find(".companyCardWrapper__interLinking").first().text().trim() || "";
      const parts = interlinking.split("|").map(p => p.trim());
      const companyType = parts[0] || "N/A";
      const headquarters = parts[1] || "N/A";

      companies.push({
        name: name,
        rating: rating,
        reviews: reviews,
        companyType: companyType,
        headquarters: headquarters,
        companyAge: "N/A",
        noOfEmployee: "N/A",
      });
    });

    return {
      isCompanyList: true,
      companies: companies,
    };
  }

  const nextDataScript = $("script#__NEXT_DATA__");

  // Determine if it is a single Job Detail Page (JDP) vs search list page
  const isJdp = (url && (url.toLowerCase().includes("-jdp") || url.toLowerCase().includes("/jobs/detail/"))) || 
                $(".jd-description, .jd-body, .jd-text, .jobDesc, .job-description, [itemprop='description']").length > 0;

  // --- JDP (Job Detail Page): extract full job from initialSelectedJob ---
  if (isJdp && nextDataScript.length > 0) {
    try {
      const parsed = JSON.parse(nextDataScript.html());
      const selectedJob = parsed?.props?.pageProps?.initialSelectedJob;
      if (selectedJob) {
        const minExp = selectedJob.minExp;
        const maxExp = selectedJob.maxExp;
        const minCtc = selectedJob.minCtc;
        const maxCtc = selectedJob.maxCtc;

        let experience = "Not Specified";
        if (minExp !== undefined && maxExp !== undefined) {
          experience = `${minExp} - ${maxExp} years`;
        } else if (minExp !== undefined) {
          experience = `${minExp}+ years`;
        }

        let salary = "Not Disclosed";
        if (!selectedJob.hideCtc) {
          if (minCtc && maxCtc) {
            salary = `₹${minCtc / 100000}L - ₹${maxCtc / 100000}L/yr`;
          } else if (minCtc) {
            salary = `₹${minCtc / 100000}L/yr`;
          } else if (maxCtc) {
            salary = `₹${maxCtc / 100000}L/yr`;
          }
        }

        let workMode = "On-site";
        const wm = String(selectedJob.workMode || "").toLowerCase();
        if (wm === "remote" || wm === "1" || wm === "wfh") workMode = "Remote";
        else if (wm === "3" || wm === "hybrid") workMode = "Hybrid";

        // Convert HTML description to readable plain text
        const rawDesc = selectedJob.description || "";
        const descriptionText = htmlToText(rawDesc);

        return {
          title: selectedJob.title || "Job Title Not Found",
          company: selectedJob.company || selectedJob.shortName || "Company Name Not Found",
          location: Array.isArray(selectedJob.locations) && selectedJob.locations.length > 0
            ? selectedJob.locations.join(", ")
            : "Not Disclosed",
          salary,
          experience,
          skills: Array.isArray(selectedJob.skills) ? selectedJob.skills : [],
          description: descriptionText || "No description provided.",
          email: null,
          contact: null,
          postedDate: selectedJob.postedOn || null,
          applyUrl: selectedJob.url || (selectedJob.jdpUrl ? `https://www.ambitionbox.com${selectedJob.jdpUrl}` : null),
          workMode,
          employmentType: selectedJob.employmentType || null,
          department: selectedJob.department?.name || null,
          industry: selectedJob.industry?.name || null,
        };
      }
    } catch (e) {
      console.warn("⚠️ [AmbitionBox Extractor] JDP __NEXT_DATA__ parse failed:", e.message);
    }
  }

  // Check if it is a jobs list page with jobInfoCard elements
  const jobCards = $(".jobInfoCard");
  if (!isJdp && jobCards.length > 0) {
    const jobs = [];
    // Get company name from page header if possible
    let companyHeader = $("h1").first().text().replace(/jobs/i, "").trim() || "AmbitionBox";
    if (companyHeader.toLowerCase().includes("retail")) {
      // Clean up company name, e.g. "100+ Reliance Retail Jobs" -> "Reliance Retail"
      const match = companyHeader.match(/(\d+\+\s*)?([A-Za-z\s]+?)\s*Jobs/i);
      if (match && match[2]) {
        companyHeader = match[2].trim();
      }
    }

    jobCards.each((_, el) => {
      const card = $(el);
      const titleLink = card.find("a.title, [class*='title']").first();
      const title = titleLink.text().trim() || card.attr("title") || "Job Title Not Found";
      let applyUrl = titleLink.attr("href") || null;
      if (applyUrl && !applyUrl.startsWith("http")) {
        applyUrl = `https://www.ambitionbox.com${applyUrl}`;
      }

      // Parse entities (Experience, Salary, Skills, etc.)
      const entities = card.find(".entity");
      let experience = "Not Specified";
      let salary = "Not Disclosed";
      const skills = [];
      let location = "Not Disclosed";

      entities.each((_, entityEl) => {
        const entity = $(entityEl);
        const titleAttr = entity.attr("title") || "";

        if (entity.find("i.icon-work, .icon-work").length > 0 || titleAttr.toLowerCase().includes("years") || titleAttr.toLowerCase().includes("exp")) {
          experience = titleAttr.trim() || entity.text().trim();
        } else if (entity.find("img[src*='payments.svg']").length > 0 || entity.find(".entity-salary-text").length > 0 || titleAttr.toLowerCase().includes("/yr") || titleAttr.toLowerCase().includes("/mo")) {
          salary = titleAttr.trim() || entity.find(".entity-salary-text").text().trim() || entity.text().trim();
        } else if (entity.find("img[data-src*='bolt.svg']").length > 0 || entity.find("img[src*='bolt.svg']").length > 0 || entity.find(".icon-bolt").length > 0) {
          const skillsList = titleAttr.split(",").map(s => s.trim()).filter(Boolean);
          if (skillsList.length > 0) {
            skills.push(...skillsList);
          } else {
            const skillText = entity.text().trim();
            if (skillText) skills.push(skillText);
          }
        }
      });

      // Try to find location from card text
      const locText = card.find(".loc, .location, [class*='location']").first().text().trim();
      if (locText) {
        location = locText;
      } else {
        // Fallback: try to extract location from title (e.g. "Store manager - Bangalore")
        const parts = title.split(" - ");
        if (parts.length > 1) {
          const possibleLoc = parts[parts.length - 1].trim();
          if (/bangalore|mumbai|kolkata|delhi|noida|gurugram|chennai|hyderabad|pune/i.test(possibleLoc)) {
            location = possibleLoc;
          }
        }
      }

      jobs.push({
        title,
        company: companyHeader,
        location,
        salary,
        experience,
        skills,
        description: null,
        email: null,
        contact: null,
        postedDate: card.find("span.body-small-l").first().text().trim() || null,
        applyUrl,
        workMode: title.toLowerCase().includes("remote") ? "Remote" : (title.toLowerCase().includes("hybrid") ? "Hybrid" : "On-site")
      });
    });

    return {
      isJobList: true,
      jobs: jobs
    };
  }

  if (!isJdp && nextDataScript.length > 0) {
    try {
      const parsed = JSON.parse(nextDataScript.html());
      const jobsList = parsed?.props?.pageProps?.jobsList;

      if (Array.isArray(jobsList) && jobsList.length > 0) {
        const jobs = jobsList.map((job) => {
          const minExp = job.minExp;
          const maxExp = job.maxExp;
          const minCtc = job.minCtc;
          const maxCtc = job.maxCtc;

          let experience = "Not Specified";
          if (minExp !== undefined && maxExp !== undefined) {
            experience = `${minExp} - ${maxExp} years`;
          } else if (minExp !== undefined) {
            experience = `${minExp}+ years`;
          }

          let salary = "Not Disclosed";
          if (minCtc && maxCtc) {
            salary = `₹${minCtc / 100000}L - ₹${maxCtc / 100000}L/yr`;
          } else if (minCtc) {
            salary = `₹${minCtc / 100000}L/yr`;
          } else if (maxCtc) {
            salary = `₹${maxCtc / 100000}L/yr`;
          }

          let workMode = "On-site";
          const wm = String(job.workMode || "").toLowerCase();
          if (wm === "remote" || wm === "1" || wm === "wfh" || (job.locations && job.locations.some(l => l.toLowerCase().includes("remote")))) {
            workMode = "Remote";
          } else if (wm === "3" || wm === "hybrid" || (job.locations && job.locations.some(l => l.toLowerCase().includes("hybrid")))) {
            workMode = "Hybrid";
          }

          return {
            title: job.title || "Job Title Not Found",
            company: job.shortName || job.company || "Company Name Not Found",
            location: Array.isArray(job.locations) && job.locations.length > 0 ? job.locations.join(", ") : "Not Disclosed",
            salary,
            experience,
            skills: Array.isArray(job.skills) ? job.skills : [],
            description: null,
            email: null,
            contact: null,
            postedDate: job.postedOn || null,
            applyUrl: job.jdpUrl ? `https://www.ambitionbox.com${job.jdpUrl}` : null,
            workMode,
          };
        });

        return {
          isJobList: true,
          jobs: jobs,
        };
      }
    } catch (e) {
      console.warn("⚠️ [AmbitionBox Extractor] JSON-LD parse failed:", e.message);
    }
  }

  return extractUsingSelectors(html, "ambitionbox");
}

