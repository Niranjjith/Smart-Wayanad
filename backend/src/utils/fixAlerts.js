// Utility script to fix existing alerts with invalid location data
import mongoose from "mongoose";
import Alert from "../models/Alert.js";
import dotenv from "dotenv";

dotenv.config();

async function fixAlerts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartwayanad");
    console.log("✅ Connected to MongoDB");

    // Find all alerts with invalid location (has type but no coordinates)
    const alerts = await Alert.find({
      location: { $exists: true },
      "location.coordinates": { $exists: false }
    });

    console.log(`Found ${alerts.length} alerts with invalid location data`);

    // Remove location field from these alerts
    for (const alert of alerts) {
      await Alert.findByIdAndUpdate(alert._id, {
        $unset: { location: "" }
      });
      console.log(`Fixed alert ${alert._id}`);
    }

    // Also fix alerts where source is admin but location exists
    const adminAlerts = await Alert.find({
      source: "admin",
      location: { $exists: true }
    });

    console.log(`Found ${adminAlerts.length} admin alerts with location data`);

    for (const alert of adminAlerts) {
      await Alert.findByIdAndUpdate(alert._id, {
        $unset: { location: "" }
      });
      console.log(`Fixed admin alert ${alert._id}`);
    }

    console.log("✅ All alerts fixed!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error fixing alerts:", err);
    process.exit(1);
  }
}

fixAlerts();

