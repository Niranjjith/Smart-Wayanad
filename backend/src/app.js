// backend/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import busRoutes from "./routes/busRoutes.js"; // ✅ make sure filename is lowercase
import chatRoutes from "./routes/chatRoutes.js";
import climateRoutes from "./routes/climateRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { ensureAdmin } from "./utils/seedAdmin.js";

// ✅ Initialize app
export const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ✅ Health check route
app.get("/", (req, res) => res.send("🌍 Smart Wayanad API running successfully..."));

// ✅ Mount routes
app.use("/api/admin", adminRoutes);
app.use("/api/help", alertRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/bus", busRoutes); // 🟢 Bus Routes CRUD
app.use("/api/chat", chatRoutes);
app.use("/api/climate", climateRoutes);
app.use("/api/users", userRoutes);

// ✅ Database + Admin Initialization
export async function bootstrap() {
  await connectDB();
  await ensureAdmin();
}

// ✅ Optional global error handler (recommended)
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});
