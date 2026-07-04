import { load } from "cheerio";
import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes AmbitionBox company pages or job postings.
 */
export function extractAmbitionBox(html) {
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

  const nextDataScript = $("#__NEXT_DATA__");

  if (nextDataScript.length > 0) {
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

