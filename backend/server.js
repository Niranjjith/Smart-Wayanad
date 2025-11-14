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
import busRoutes from "./src/routes/busRoutes.js";
import locationRoutes from "./src/routes/locationRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import climateRoutes from "./src/routes/climateRoutes.js";

// 🟢 ADD THIS — Help Alerts Route
import alertRoutes from "./src/routes/alertRoutes.js";

import User from "./src/models/User.js";

dotenv.config();

const app = express();
app.use(express.json());

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

  socket.on("disconnect", () =>
    console.log("❌ Client disconnected:", socket.id)
  );
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
