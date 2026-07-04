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
  const { url } = req.body;
  if (!url) {
    return ResponseHelper.error(res, "URL is required", 400);
  }

  try {
    const jobData = await parseJob(url);

    if (getDBStatus()) {
      // Save parsed data to MongoDB
      const job = await Job.create({
        ...jobData,
        sourceUrl: url,
      });

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
      const cached = saveToCache({
        ...jobData,
        sourceUrl: url,
      });
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
