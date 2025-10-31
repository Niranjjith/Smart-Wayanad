import Admin from "../models/Admin.js";

export async function ensureAdmin() {
  const email = String(process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = String(process.env.ADMIN_PASSWORD || "");
  const forceReset = String(process.env.ADMIN_FORCE_RESET || "false").toLowerCase() === "true";

  if (!email || !password) {
    console.warn("⚠️  Skipping admin bootstrap: ADMIN_EMAIL/ADMIN_PASSWORD not set.");
    return;
  }

  const existing = await Admin.findOne({ username: email });

  if (!existing) {
    await Admin.create({ username: email, password }); // plaintext -> pre-save hashes
    console.log(`✅ Admin created: ${email}`);
    return;
  }

  if (forceReset) {
    existing.password = password; // plaintext -> pre-save hashes (pre-save detects & hashes)
    await existing.save();
    console.log(`🔁 Admin password reset for ${email}`);
  } else {
    console.log(`ℹ️  Admin exists: ${email} (no reset)`);
  }
}
