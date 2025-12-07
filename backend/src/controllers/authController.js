// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET || "smartwayanadsecret", // make sure to set JWT_SECRET in .env
    { expiresIn: "7d" }
  );
};

// ✅ REGISTER — POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ✅ LOGIN — POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ✅ GET PROFILE — GET /api/auth/profile (Protected route)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Profile error:", err);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

// ✅ UPDATE PROFILE — PUT /api/auth/profile (Protected route)
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password, profilePhoto } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name if provided
    if (name) user.name = name;

    // Update email if provided (check for duplicates)
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update profile photo if provided
    if (profilePhoto !== undefined) {
      user.profilePhoto = profilePhoto;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Update profile error:", err);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};