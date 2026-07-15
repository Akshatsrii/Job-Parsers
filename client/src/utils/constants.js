// In production (Vercel), VITE_API_BASE_URL is not set (since .env is gitignored).
// Vercel rewrites /api/* → https://job-parsers-2.onrender.com/api/* via vercel.json.
// In local dev, the Vite proxy handles /api → localhost:5000.
// So we always use relative "/api" UNLESS an explicit non-localhost URL is provided.
const envUrl = import.meta.env.VITE_API_BASE_URL || "";
let baseUrl = "/api";
if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
  // Only use the env URL if it's a real production URL (not localhost)
  baseUrl = envUrl.replace(/\/$/, "");
  if (!baseUrl.endsWith("/api")) baseUrl += "/api";
}
export const API_BASE_URL = baseUrl;

export const SUPPORTED_SITES = [
  { name: "Internshala", domain: "internshala.com" },
  { name: "AmbitionBox", domain: "ambitionbox.com" },
  { name: "Naukri", domain: "naukri.com" },
  { name: "Indeed", domain: "indeed.com" },
  { name: "LinkedIn", domain: "linkedin.com" },
  { name: "Foundit", domain: "foundit.in" },
];

export const PARSE_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export const LOCAL_STORAGE_KEYS = {
  THEME: "job_parser_theme",
  HISTORY: "job_parser_history",
};
