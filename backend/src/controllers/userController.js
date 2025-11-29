import User from "../models/User.js";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, "../../uploads/profiles");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, settings } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (settings) updateData.settings = settings;

    // Handle profile photo upload
    if (req.file) {
      updateData.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user settings
export const updateUserSettings = async (req, res) => {
  try {
    const { darkMode, notifications, language } = req.body;
    const settings = {};

    if (darkMode !== undefined) settings.darkMode = darkMode;
    if (notifications !== undefined) settings.notifications = notifications;
    if (language) settings.language = language;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { settings } },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users (for admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
