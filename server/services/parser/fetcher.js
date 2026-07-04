import axiosClient from "../../config/axios.js";

/**
 * Fetch static HTML content using Axios
 */
export async function fetchHtml(url) {
  try {
    const response = await axiosClient.get(url);
    return response.data;
  } catch (error) {
    console.error(`❌ Static fetch failed for ${url}:`, error.message);
    throw new Error(`Failed to fetch page content: ${error.message}`);
  }
}
