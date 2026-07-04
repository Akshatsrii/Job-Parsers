import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

let isConnected = false;

export async function connectDB() {
  if (!MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI environment variable is not defined. Running in in-memory mode.");
    return false;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.warn("⚠️ Running in in-memory mode. History will not be persistent.");
    return false;
  }
}

export function getDBStatus() {
  return isConnected;
}
