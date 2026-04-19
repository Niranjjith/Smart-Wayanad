// backend/app.js
import dotenv from "dotenv";
dotenv.config(); // <-- load environment variables

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import busRoutes from "./routes/BusRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import climateRoutes from "./routes/climateRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { ensureAdmin } from "./utils/seedAdmin.js";
import seedDemoDataIfNeeded from "./utils/seedDemoData.js";

// Initialize app
export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Health check
app.get("/", (req, res) => res.send("🌍 Smart Wayanad API running successfully..."));

// Mount routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/help", alertRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/climate", climateRoutes);
app.use("/api/users", userRoutes);

// Bootstrap DB + Admin
export async function bootstrap() {
  await connectDB();
  await ensureAdmin();
  try {
    await seedDemoDataIfNeeded();
  } catch (e) {
    console.error("❌ Demo seed error:", e.message);
  }
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});
