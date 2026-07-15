 import Job from "../models/Job.js";
import History from "../models/History.js";
import { getDBStatus } from "../config/db.js";
import {
  getHistoryFromCache,
  saveToCache,
  deleteFromCache,
  clearCache,
} from "../cache/memoryCache.js";
import { parseJob } from "../services/parser/index.js";
import ResponseHelper from "../helpers/response.js";

async function populateJobDetails(jobs) {
  const concurrencyLimit = 5;
  const results = [...jobs];
  
  for (let i = 0; i < results.length; i += concurrencyLimit) {
    const batch = results.slice(i, i + concurrencyLimit);
    await Promise.all(
      batch.map(async (job) => {
        if (job.applyUrl) {
          try {
            console.log(`🤖 [Auto-Scrape] Fetching details for: ${job.applyUrl}`);
            const details = await parseJob(job.applyUrl);
            if (details) {
              job.description = details.description || job.description;
              job.email = details.email || job.email;
              job.contact = details.contact || job.contact;
              if (details.skills && details.skills.length > 0) {
                job.skills = details.skills;
              }
              if (details.salary && details.salary !== "Not Disclosed") {
                job.salary = details.salary;
              }
              if (details.experience && details.experience !== "Not Specified") {
                job.experience = details.experience;
              }
            }
          } catch (err) {
            console.warn(`⚠️ [Auto-Scrape] Failed for ${job.applyUrl}:`, err.message);
          }
        }
      })
    );
  }
}

// Helper to limit concurrency of async tasks
async function limitConcurrency(tasks, limit) {
  const results = [];
  const executing = [];
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    if (limit <= tasks.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}

export async function parseUrl(req, res, next) {
  const { url, pages = 1 } = req.body;
  console.log("🤖 [Backend parseUrl] Incoming Request Body:", req.body);
  if (!url) {
    return ResponseHelper.error(res, "URL is required", 400);
  }

  try {
    let jobData = await parseJob(url);

    // Support paginated scraping for lists (jobs or companies)
    const numPages = Math.min(Math.max(parseInt(pages) || 1, 1), 50);
    if (numPages > 1 && (jobData.isJobList || jobData.isCompanyList)) {
      try {
        const urlObj = new URL(url);
        let startPage = 1;
        if (urlObj.searchParams.has("page")) {
          startPage = parseInt(urlObj.searchParams.get("page")) || 1;
        }

        const taskFns = [];
        for (let i = 1; i < numPages; i++) {
          const nextPageNum = startPage + i;
          const pageUrlObj = new URL(url);
          pageUrlObj.searchParams.set("page", nextPageNum);
          const nextPageUrl = pageUrlObj.toString();

          taskFns.push(async () => {
            console.log(`🤖 [Pagination] Concurrently scraping page ${nextPageNum}: ${nextPageUrl}`);
            try {
              return await parseJob(nextPageUrl);
            } catch (err) {
              console.error(`⚠️ Page ${nextPageNum} failed:`, err.message);
              return null;
            }
          });
        }

        // Run pagination tasks in parallel with a concurrency limit of 5
        const pagesData = await limitConcurrency(taskFns, 5);

        for (const nextPageData of pagesData) {
          if (!nextPageData) continue;
          if (jobData.isJobList && nextPageData.isJobList && Array.isArray(nextPageData.jobs)) {
            jobData.jobs = jobData.jobs.concat(nextPageData.jobs);
          } else if (jobData.isCompanyList && nextPageData.isCompanyList && Array.isArray(nextPageData.companies)) {
            jobData.companies = jobData.companies.concat(nextPageData.companies);
          }
        }
      } catch (paginateError) {
        console.error("⚠️ Pagination error during scraping:", paginateError.message);
      }
    }

    // Auto-populate details for the jobs in the list (capped at first 20 jobs to prevent Render 30s timeout)
    if (jobData.isJobList && Array.isArray(jobData.jobs)) {
      const jobsToPopulate = jobData.jobs.slice(0, 20);
      console.log(`🤖 [Auto-Scrape] Populating details for first ${jobsToPopulate.length} jobs...`);
      await populateJobDetails(jobsToPopulate);
    }

    const getSourceName = (u) => {
      const lower = u.toLowerCase();
      if (lower.includes("ambitionbox.com")) return "AmbitionBox";
      if (lower.includes("internshala.com")) return "Internshala";
      if (lower.includes("naukri.com")) return "Naukri";
      if (lower.includes("indeed.com")) return "Indeed";
      if (lower.includes("linkedin.com")) return "LinkedIn";
      return "Job Portal";
    };

    const payload = jobData.isJobList ? {
      title: `Job List: ${jobData.jobs.length} jobs found`,
      company: getSourceName(url),
      description: `Extracted ${jobData.jobs.length} jobs from the listing URL.`,
      isJobList: true,
      jobs: jobData.jobs,
      sourceUrl: url,
    } : jobData.isCompanyList ? {
      title: `Company List: ${jobData.companies.length} companies found`,
      company: getSourceName(url),
      description: `Extracted ${jobData.companies.length} companies from the listing URL.`,
      isCompanyList: true,
      companies: jobData.companies,
      sourceUrl: url,
    } : {
      ...jobData,
      sourceUrl: url,
    };

    if (getDBStatus()) {
      // Save parsed data to MongoDB
      const job = await Job.create(payload);

      const historyItem = await History.create({
        jobId: job._id,
        title: job.title,
        company: job.company,
        sourceUrl: url,
        parsedAt: job.parsedAt,
      });

      // Format response to match history layout format (using jobId as ID reference)
      const responseData = {
        ...job.toObject(),
        id: historyItem._id, // match history item deletion ID
      };

      return ResponseHelper.success(res, responseData, "Job parsed and saved successfully", 200);
    } else {
      // In-memory cache fallback
      const cached = saveToCache(payload);
      // Ensure the id matches what frontend expects for deleting/viewing
      const responseData = {
        ...cached,
        id: cached._id,
      };
      return ResponseHelper.success(res, responseData, "Job parsed successfully (in-memory)", 200);
    }
  } catch (error) {
    console.error("❌ Controller parse error:", error);
    return ResponseHelper.error(res, error.message || "Failed to parse job URL", 500);
  }
}

export async function getHistory(req, res, next) {
  try {
    if (getDBStatus()) {
      const history = await History.find({}).sort({ parsedAt: -1 }).limit(50);
      
      // Enriched history map containing 'id' to work with client logic
      const historyList = history.map((item) => ({
        id: item._id,
        title: item.title,
        company: item.company,
        sourceUrl: item.sourceUrl,
        parsedAt: item.parsedAt,
      }));

      return ResponseHelper.success(res, historyList, "History retrieved successfully");
    } else {
      const cacheHistory = getHistoryFromCache().map((item) => ({
        id: item._id,
        title: item.title,
        company: item.company,
        sourceUrl: item.sourceUrl,
        parsedAt: item.parsedAt,
      }));
      return ResponseHelper.success(res, cacheHistory, "History retrieved successfully (in-memory)");
    }
  } catch (error) {
    next(error);
  }
}

export async function deleteHistoryItem(req, res, next) {
  const { id } = req.params;
  try {
    if (getDBStatus()) {
      const historyItem = await History.findById(id);
      if (!historyItem) {
        return ResponseHelper.error(res, "History item not found", 404);
      }
      
      // Delete history item
      await History.findByIdAndDelete(id);
      
      // Try to clean up associated job data as well (optional)
      try {
        await Job.findByIdAndDelete(historyItem.jobId);
      } catch (err) {
        // fail silently if job was already deleted or doesn't exist
      }
      
      return ResponseHelper.success(res, null, "History item deleted successfully");
    } else {
      const deleted = deleteFromCache(id);
      if (!deleted) {
        return ResponseHelper.error(res, "History item not found in cache", 404);
      }
      return ResponseHelper.success(res, null, "History item deleted successfully (in-memory)");
    }
  } catch (error) {
    next(error);
  }
}

export async function clearHistory(req, res, next) {
  try {
    if (getDBStatus()) {
      await History.deleteMany({});
      // Optional: clean up Jobs too
      await Job.deleteMany({});
      return ResponseHelper.success(res, null, "All history cleared successfully");
    } else {
      clearCache();
      return ResponseHelper.success(res, null, "All history cleared successfully (in-memory)");
    }
  } catch (error) {
    next(error);
  }
}

export async function chatWithGemini(req, res, next) {
  const { prompt, contents, responseMimeType } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "PLACEHOLDER_GEMINI_KEY") {
    return ResponseHelper.error(res, "Gemini API Key is not configured on the server. Please add GEMINI_API_KEY in the server's .env file.", 400);
  }

  if (!prompt && !contents) {
    return ResponseHelper.error(res, "Prompt or contents are required", 400);
  }

  try {
    const body = {
      contents: contents || [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    };

    if (responseMimeType) {
      body.generationConfig = { responseMimeType };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return ResponseHelper.error(res, "Failed to fetch response from Gemini API", 500);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    return ResponseHelper.success(res, { reply }, "Chat response generated successfully", 200);
  } catch (err) {
    console.error("Error in chatWithGemini:", err);
    return ResponseHelper.error(res, err.message || "Failed to process chat", 500);
  }
}

