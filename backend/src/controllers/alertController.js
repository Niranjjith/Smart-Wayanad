import Alert from "../models/Alert.js";

// ----------------------------------------
// CREATE ALERT
// ----------------------------------------
export async function createAlert(req, res) {
  try {
    const { name, message, lat, lng, phone } = req.body;

    // Validate required inputs
    if (!name || !message || lat == null || lng == null) {
      return res.status(400).json({
        message: "Name, message, lat and lng are required",
      });
    }

    // Create the alert
    const alert = await Alert.create({
      name,
      phone: phone || "",
      message,
      status: "pending",
      location: {
        type: "Point",
        coordinates: [lng, lat], // GeoJSON format (lng, lat)
      },
    });

    // Emit real-time event to admin dashboard
    const io = req.app.get("io");
    if (io) io.emit("help:new", alert);

    res.status(201).json(alert);
  } catch (err) {
    console.error("❌ createAlert error:", err);
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

    // Real-time update event
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

    // Real-time delete event
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
