// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import bcrypt from "bcryptjs";
import connectDB from "./src/config/db.js";

// Route Imports
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import busRoutes from "./src/routes/BusRoutes.js";
import locationRoutes from "./src/routes/locationRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import climateRoutes from "./src/routes/climateRoutes.js";
import chatbotRoutes from "./src/routes/chatbotRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";

// 🟢 ADD THIS — Help Alerts Route
import alertRoutes from "./src/routes/alertRoutes.js";

import User from "./src/models/User.js";

dotenv.config();

const app = express();
// Increase body parser limit to handle base64 images (10MB limit)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files (uploaded profile photos)
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(join(__dirname, "uploads")));

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.1.2:5173",
      "http://localhost:5000",
      "http://192.168.1.2:5000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MongoDB
connectDB();

// Ensure Admin
const createAdminIfMissing = async () => {
  try {
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (!existing || process.env.ADMIN_FORCE_RESET === "true") {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      await User.findOneAndUpdate(
        { email: process.env.ADMIN_EMAIL },
        {
          name: "Administrator",
          email: process.env.ADMIN_EMAIL,
          password: hashed,
        },
        { upsert: true, new: true }
      );

      console.log("✅ Admin ensured:", process.env.ADMIN_EMAIL);
    }
  } catch (err) {
    console.error("❌ Admin creation error:", err);
  }
};
createAdminIfMissing();

// ------------------------------------
// Register API Routes
// ------------------------------------
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/climate", climateRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/analytics", analyticsRoutes);

// 🟢 FIX — Register Help Alerts Route
app.use("/api/help", alertRoutes);

// Root
app.get("/", (req, res) =>
  res.send("🚀 Smart Wayanad Backend Running & Connected...")
);

// Socket.IO Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://192.168.1.2:5173",
      "http://localhost:5000",
      "http://192.168.1.2:5000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  // Send initial analytics on connection
  socket.on("analytics:subscribe", async () => {
    try {
      const { getRealtimeAnalytics } = await import("./src/services/realtimeService.js");
      const analytics = await getRealtimeAnalytics();
      socket.emit("analytics:update", analytics);
    } catch (err) {
      console.error("Error sending initial analytics:", err);
    }
  });

  socket.on("disconnect", () =>
    console.log("❌ Client disconnected:", socket.id)
  );
});

// Initialize real-time service
import("./src/services/realtimeService.js").then(({ initializeRealtime }) => {
  initializeRealtime(io);
  console.log("✅ Real-time analytics service initialized");
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
