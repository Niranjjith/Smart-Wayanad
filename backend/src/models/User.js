// backend/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    settings: {
      darkMode: { type: Boolean, default: false },
      notifications: { type: Boolean, default: true },
      language: { type: String, default: "en" }, // en, ml (Malayalam)
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
