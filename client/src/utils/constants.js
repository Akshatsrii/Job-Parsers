// In production (Vercel), we bypass the Vercel /api proxy to avoid Vercel's strict 10s-30s timeout limits.
// We call the Render backend directly.
const envUrl = import.meta.env.VITE_API_BASE_URL || "";
let baseUrl = import.meta.env.PROD 
  ? "https://job-parsers-2.onrender.com/api" 
  : "/api";

if (envUrl) {
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
