import Alert from "../models/Alert.js";

// ----------------------------------------
// CREATE ALERT (User Emergency)
// ----------------------------------------
export async function createAlert(req, res) {
  try {
    const { name, message, lat, lng, phone, alertType } = req.body;

    // Required validation
    if (!name || !message || lat == null || lng == null) {
      return res.status(400).json({
        message: "Name, message, lat and lng are required",
      });
    }

    // Create the alert entry
    const alert = await Alert.create({
      name,
      phone: phone || "",
      message,
      status: "pending",
      alertType: alertType || "emergency",
      source: "user",
      priority: "high",
      location: {
        type: "Point",
        coordinates: [lng, lat], // GeoJSON format (lng, lat)
      },
    });

    // Emit real-time event
    const io = req.app.get("io");
    if (io) io.emit("help:new", alert);
    if (io) io.emit("alert:new", alert); // For notifications

    res.status(201).json(alert);
  } catch (err) {
    console.error("❌ createAlert error:", err);
    res.status(500).json({ message: err.message });
  }
}

// ----------------------------------------
// CREATE ADMIN ALERT (Broadcast)
// ----------------------------------------
export async function createAdminAlert(req, res) {
  try {
    const { message, alertType, priority } = req.body;

    // Required validation
    if (!message || !alertType) {
      return res.status(400).json({
        message: "Message and alertType are required",
      });
    }

    // Create the admin alert entry (without location)
    // Don't include location field at all for admin alerts
    const alert = await Alert.create({
      name: "Admin",
      phone: "",
      message,
      status: "active",
      alertType: alertType || "other",
      source: "admin",
      priority: priority || "high",
      // Explicitly don't set location - pre-save hook will handle it
    });
    
    // Ensure location is removed (pre-save hook should handle this, but double-check)
    const cleanAlert = await Alert.findById(alert._id).lean();
    if (cleanAlert && cleanAlert.location) {
      delete cleanAlert.location;
    }
    
    // Use the clean alert for response
    const finalAlert = cleanAlert || alert.toObject();
    // Remove location if it somehow still exists
    if (finalAlert.location) {
      delete finalAlert.location;
    }

    // Emit real-time event to all users
    const io = req.app.get("io");
    if (io) {
      io.emit("alert:new", finalAlert); // For notifications page
      io.emit("admin:alert", finalAlert); // For real-time notifications
    }

    res.status(201).json(finalAlert);
  } catch (err) {
    console.error("❌ createAdminAlert error:", err);
    res.status(500).json({ message: err.message });
  }
}

// ----------------------------------------
// GET ALL ALERTS
// ----------------------------------------
export async function getAlerts(req, res) {
  try {
    const data = await Alert.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("❌ getAlerts error:", err);
    res.status(500).json({ message: err.message });
  }
}

// ----------------------------------------
// UPDATE ALERT
// ----------------------------------------
export async function updateAlert(req, res) {
  try {
    const updated = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Alert not found" });
    }

    const io = req.app.get("io");
    if (io) io.emit("help:update", updated);

    res.json(updated);
  } catch (err) {
    console.error("❌ updateAlert error:", err);
    res.status(500).json({ message: err.message });
  }
}

// ----------------------------------------
// DELETE ALERT
// ----------------------------------------
export async function deleteAlert(req, res) {
  try {
    const deleted = await Alert.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Alert not found" });
    }

    const io = req.app.get("io");
    if (io) io.emit("help:delete", deleted._id);

    res.json({
      message: "Deleted successfully",
      id: deleted._id,
    });
  } catch (err) {
    console.error("❌ deleteAlert error:", err);
    res.status(500).json({ message: err.message });
  }
}

// ----------------------------------------
// UPDATE LIVE LOCATION (Real-time tracking)
// ----------------------------------------
export async function updateLiveLocation(req, res) {
  try {
    const { lat, lng, alertId } = req.body;

    if (lat == null || lng == null) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    // If alertId is provided, update that specific alert
    if (alertId) {
      const alert = await Alert.findByIdAndUpdate(
        alertId,
        {
          $set: {
            location: {
              type: "Point",
              coordinates: [lng, lat],
            },
          },
        },
        { new: true }
      );

      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }

      // Emit real-time location update
      const io = req.app.get("io");
      if (io) io.emit("alert:location-update", { alertId, lat, lng });

      return res.json({ success: true, alert });
    }

    // Otherwise, just acknowledge the location update
    // (for tracking purposes without a specific alert)
    const io = req.app.get("io");
    if (io) io.emit("location:update", { lat, lng });

    res.json({ success: true, message: "Location updated" });
  } catch (err) {
    console.error("❌ updateLiveLocation error:", err);
    res.status(500).json({ message: err.message });
  }
}
