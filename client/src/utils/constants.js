let baseUrl = import.meta.env.VITE_API_BASE_URL || "/api";
if (baseUrl.startsWith("http") && !baseUrl.endsWith("/api")) {
  baseUrl = baseUrl.replace(/\/$/, "") + "/api";
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
