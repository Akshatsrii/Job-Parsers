import { load } from "cheerio";
import { extractUsingSelectors } from "../utils.js";

/**
 * Scrapes AmbitionBox company pages or job postings.
 */
export function extractAmbitionBox(html) {
  const $ = load(html);
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

