import axios from "axios";
import { PROXY_URL } from "./env.js";

let proxyConfig = false;
if (PROXY_URL) {
  try {
    const url = new URL(PROXY_URL);
    proxyConfig = {
      protocol: url.protocol.replace(":", ""),
      host: url.hostname,
      port: parseInt(url.port) || (url.protocol.startsWith("https") ? 443 : 80),
      auth: url.username ? {
        username: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password)
      } : undefined
    };
    console.log(`📡 [Axios] Configured proxy host: ${proxyConfig.host}`);
  } catch (err) {
    console.error("❌ [Axios] Invalid PROXY_URL configuration:", err.message);
  }
}

const axiosClient = axios.create({
  timeout: 30000,
  proxy: proxyConfig,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "close",
    "Upgrade-Insecure-Requests": "1"
  }
});

export default axiosClient;
