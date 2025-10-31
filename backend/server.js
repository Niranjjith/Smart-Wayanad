import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import bcrypt from "bcryptjs";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import busRoutes from "./src/routes/busRoutes.js";
import User from "./src/models/User.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Ensure Admin Exists
const createAdminIfMissing = async () => {
  try {
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existing || process.env.ADMIN_FORCE_RESET === "true") {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.findOneAndUpdate(
        { email: process.env.ADMIN_EMAIL },
        { name: "Administrator", email: process.env.ADMIN_EMAIL, password: hashed },
        { upsert: true, new: true }
      );
      console.log("✅ Admin ensured:", process.env.ADMIN_EMAIL);
    }
  } catch (err) {
    console.error("❌ Admin creation error:", err);
  }
};
createAdminIfMissing();

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bus", busRoutes); // ✅ Matches your frontend

// ✅ Root route
app.get("/", (req, res) => res.send("🚀 Smart Wayanad Backend Running..."));

// ✅ Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",      // Admin React
      "http://192.168.1.2:5173",    // LAN
      "http://192.168.1.2:5000",    // Flutter
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);
  socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
