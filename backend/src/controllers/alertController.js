import Alert from "../models/Alert.js";

export async function createAlert(req, res) {
  try {
    const alert = await Alert.create(req.body);
    const io = req.app.get("io");
    if (io) io.emit("help:new", alert);
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getAlerts(req, res) {
  const data = await Alert.find().sort({ createdAt: -1 });
  res.json(data);
}

export async function updateAlert(req, res) {
  const updated = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
}

export async function deleteAlert(req, res) {
  await Alert.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}
