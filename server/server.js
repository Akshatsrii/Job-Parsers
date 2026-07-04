import express from "express";
import cors from "cors";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";
import { PORT } from "./config/env.js";
import parserRoutes from "./routes/parser.routes.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
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
  });
}

start();
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Job Parser API is running 🚀",
  });
});