import { load } from "cheerio";

/**
 * Universal fallback parser using JSON-LD (Schema.org), Meta, and HTML semantic fallback.
 */
export function extractGeneric(html) {
  const $ = load(html);
  
  const data = {
    title: "",
    company: "",
    location: "",
    salary: "",
    experience: "",
    skills: [],
    description: "",
  };

  // --- Step 1: Scan for JSON-LD JobPosting schema ---
  let jobSchema = null;
  $("script[type='application/ld+json']").each((_, el) => {
    try {
      const rawText = $(el).html();
      const parsed = JSON.parse(rawText);

      // Deep search helper to find the JobPosting type inside nested JSON
      const searchSchema = (obj) => {
        if (!obj) return;
        if (Array.isArray(obj)) {
          for (const item of obj) {
            searchSchema(item);
            if (jobSchema) return;
          }
        } else if (typeof obj === "object") {
          if (obj["@type"] === "JobPosting") {
            jobSchema = obj;
            return;
          }
          for (const key in obj) {
            searchSchema(obj[key]);
            if (jobSchema) return;
          }
        }
      };

      searchSchema(parsed);
      if (jobSchema) return false; // Break Cheerio loop
    } catch (e) {
      // Ignore invalid JSON structures
    }
  });

  if (jobSchema) {
    data.title = jobSchema.title || "";
    
    // Extract company
    if (jobSchema.hiringOrganization) {
      if (typeof jobSchema.hiringOrganization === "string") {
        data.company = jobSchema.hiringOrganization;
      } else if (jobSchema.hiringOrganization.name) {
        data.company = jobSchema.hiringOrganization.name;
      }
    }

    // Extract location
    if (jobSchema.jobLocation) {
      if (Array.isArray(jobSchema.jobLocation)) {
        const firstLoc = jobSchema.jobLocation[0];
        if (firstLoc && firstLoc.address) {
          data.location = firstLoc.address.addressLocality || firstLoc.address.addressRegion || "";
        }
      } else if (typeof jobSchema.jobLocation === "object") {
        const address = jobSchema.jobLocation.address;
        if (address) {
          data.location = typeof address === "string" 
            ? address 
            : [address.addressLocality, address.addressRegion, address.addressCountry]
                .filter(Boolean)
                .join(", ");
        }
      }
    }

    // Extract salary
    if (jobSchema.baseSalary) {
      if (typeof jobSchema.baseSalary === "object") {
        const val = jobSchema.baseSalary.value;
        if (val) {
          if (typeof val === "object") {
            const min = val.minValue || val.value || "";
            const max = val.maxValue || "";
            const currency = jobSchema.baseSalary.currency || "";
            data.salary = min && max ? `${currency} ${min} - ${max}` : `${currency} ${min || max}`;
          } else {
            data.salary = `${jobSchema.baseSalary.currency || ""} ${val}`;
          }
        }
      } else {
        data.salary = String(jobSchema.baseSalary);
      }
    }

    // Extract description
    if (jobSchema.description) {
      // JSON-LD descriptions often contain HTML tags; load it into Cheerio to strip tags
      data.description = load(jobSchema.description).text();
    }

    // Extract skills if specified in schema
    if (Array.isArray(jobSchema.skills)) {
      data.skills = jobSchema.skills;
    } else if (typeof jobSchema.skills === "string") {
      data.skills = jobSchema.skills.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  // --- Step 2: Open Graph & Metadata Fallback ---
  if (!data.title) {
    data.title = $("meta[property='og:title']").attr("content") ||
                 $("meta[name='twitter:title']").attr("content") ||
                 $("title").text();
  }

  if (!data.company) {
    data.company = $("meta[property='og:site_name']").attr("content") ||
                   $("meta[name='twitter:site']").attr("content");
  }

  if (!data.description) {
    data.description = $("meta[property='og:description']").attr("content") ||
                       $("meta[name='description']").attr("content") ||
                       $("meta[name='twitter:description']").attr("content");
  }

  // --- Step 3: Semantic DOM Fallback ---
  if (!data.title) {
    // Standard job details layouts use the first h1
    data.title = $("h1").first().text();
  }

  // Ensure title and description are cleaned up of extra spaces
  if (data.title) data.title = data.title.trim();
  if (data.company) data.company = data.company.trim();
  if (data.location) data.location = data.location.trim();
  if (data.salary) data.salary = data.salary.trim();
  if (data.description) data.description = data.description.trim();

  return data;
}
