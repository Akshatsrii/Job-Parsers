import { createContext, useCallback, useContext, useState } from "react";
import toast from "react-hot-toast";
import { extractJobData } from "../services/parser.service.js";
import { PARSE_STATUS, LOCAL_STORAGE_KEYS } from "../utils/constants.js";
import { generateId } from "../utils/helpers.js";

const ParserContext = createContext(null);

function loadHistory() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch {
    // storage full or unavailable - fail silently
  }
}

export function ParserProvider({ children }) {
  const [status, setStatus] = useState(PARSE_STATUS.IDLE);
  const [jobData, setJobData] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(loadHistory);

  const parseUrl = useCallback(async (url, pages = 1) => {
    setStatus(PARSE_STATUS.LOADING);
    setError("");
    try {
      const data = await extractJobData(url, pages);
      const enrichedData = { ...data, sourceUrl: url, id: generateId(), parsedAt: new Date().toISOString() };
      setJobData(enrichedData);
      setStatus(PARSE_STATUS.SUCCESS);

      setHistory((prev) => {
        const updated = [enrichedData, ...prev].slice(0, 50);
        saveHistory(updated);
        return updated;
      });

      toast.success("Job data extracted successfully!");
      return enrichedData;
    } catch (err) {
      setStatus(PARSE_STATUS.ERROR);
      setError(err.message);
      toast.error(err.message || "Failed to parse job URL");
      throw err;
    }
  }, []);

  const clearResult = useCallback(() => {
    setJobData(null);
    setStatus(PARSE_STATUS.IDLE);
    setError("");
  }, []);

  const removeFromHistory = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const value = {
    status,
    jobData,
    error,
    history,
    parseUrl,
    clearResult,
    removeFromHistory,
    clearHistory,
  };

  return <ParserContext.Provider value={value}>{children}</ParserContext.Provider>;
}

export function useParserContext() {
  const ctx = useContext(ParserContext);
  if (!ctx) {
    throw new Error("useParserContext must be used within a ParserProvider");
  }
  return ctx;
}
