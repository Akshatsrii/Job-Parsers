import axios from "axios";
import { API_BASE_URL } from "../utils/constants.js";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90s to handle Render cold start (free tier sleeps after 15min inactivity)
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
