import express from "express";
import cors from "cors";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";
import { PORT } from "./config/env.js";
import parserRoutes from "./routes/parser.routes.js";

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://job-parsers.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.includes(origin) || 
                        origin.endsWith(".vercel.app");
                        
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, false); // Block other origins cleanly without throwing uncaught server errors
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Root health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/parser", parserRoutes);

// Wildcard undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Requested route does not exist",
  });
});

// Centralized error handler
app.use(errorHandler);

// Connect database and launch server
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Job Parser Backend listening on http://localhost:${PORT}`);
    console.log(`💡 Proxy target for Vite client: http://localhost:${PORT}/api`);
    
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "PLACEHOLDER_GEMINI_KEY") {
      console.warn("⚠️  [Warning] GEMINI_API_KEY is not configured in server/.env");
    } else {
      console.log("✅ [Success] GEMINI_API_KEY loaded successfully from server/.env");
    }
  });
}


start();
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Job Parser API is running 🚀",
  });
});