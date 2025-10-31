import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "./src/models/Admin.js";

dotenv.config();

const resetPassword = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await Admin.findOne({ username: "admin@gmail.com" });
  if (!admin) {
    console.log("No admin found.");
    process.exit(0);
  }
  const hashed = await bcrypt.hash("123456", 10);
  admin.password = hashed;
  await admin.save();
  console.log("✅ Admin password reset to 123456 (hashed)");
  process.exit(0);
};

resetPassword();
