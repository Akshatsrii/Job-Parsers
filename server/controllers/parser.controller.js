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

export async function parseUrl(req, res, next) {
  const { url, pages = 1 } = req.body;
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

        for (let i = 1; i < numPages; i++) {
          const nextPageNum = startPage + i;
          urlObj.searchParams.set("page", nextPageNum);
          const nextPageUrl = urlObj.toString();

          console.log(`🤖 [Pagination] Scraping page ${nextPageNum}: ${nextPageUrl}`);
          const nextPageData = await parseJob(nextPageUrl);

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
