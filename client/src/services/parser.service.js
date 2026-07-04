import { parseJobUrl } from "../api/parser.api.js";

export async function extractJobData(url, pages = 1) {
  try {
    const response = await parseJobUrl(url, pages);
    if (!response?.success) {
      throw new Error(response?.message || "Failed to parse job data");
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Failed to parse job data");
  }
}
