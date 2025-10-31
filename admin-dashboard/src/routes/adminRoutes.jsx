import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";

const router = express.Router();

// ⚙️ Preload default admin
router.post("/seed", async (req, res) => {
  try {
    const exists = await Admin.findOne({ username: "admin@gmail.com" });
    if (exists) return res.json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash("123456", 10);
    await Admin.create({ username: "admin@gmail.com", password: hashed });
    res.json({ message: "✅ Admin seeded: admin@gmail.com / 123456" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
