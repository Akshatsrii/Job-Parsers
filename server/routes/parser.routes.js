import { Router } from "express";
import {
  parseUrl,
  getHistory,
  deleteHistoryItem,
  clearHistory,
  chatWithGemini,
} from "../controllers/parser.controller.js";
import rateLimiter from "../middleware/rateLimiter.js";
import auth from "../middleware/auth.js";

const router = Router();

// Routes definitions
router.post("/parse", rateLimiter, auth, parseUrl);
router.post("/chat", chatWithGemini);
router.get("/history", auth, getHistory);
router.delete("/history/:id", auth, deleteHistoryItem);
router.delete("/history", auth, clearHistory);

export default router;
