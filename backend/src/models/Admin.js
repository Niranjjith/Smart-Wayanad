import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

// Detect if already a bcrypt hash to avoid double-hashing
function looksHashed(pw) {
  return typeof pw === "string" && /^\$2[aby]\$[\d]{2}\$/.test(pw);
}

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (looksHashed(this.password)) return next(); // don't hash again
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("Admin", adminSchema);
