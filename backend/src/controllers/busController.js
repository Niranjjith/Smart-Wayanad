import mongoose from "mongoose";
import BusRoute from "../models/BusRoute.js";

// 🟢 Fetch all routes
export const getBusRoutes = async (req, res) => {
  try {
    const routes = await BusRoute.find().sort({ createdAt: -1 });
    res.status(200).json(routes);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch bus routes" });
  }
};

// 🟢 Add new route
export const addBusRoute = async (req, res) => {
  try {
    const { routeNo, origin, destination, firstBus, lastBus, frequencyMin } = req.body;

    if (!routeNo || !origin || !destination)
      return res.status(400).json({ message: "Route No, Origin, Destination required" });

    const route = await BusRoute.create({
      routeNo,
      origin,
      destination,
      firstBus,
      lastBus,
      frequencyMin,
    });

    res.status(201).json(route);
  } catch (err) {
    console.error("❌ Add error:", err);
    res.status(500).json({ message: "Failed to add route" });
  }
};

// 🟢 Update route safely
export const updateBusRoute = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid route ID" });

    const route = await BusRoute.findByIdAndUpdate(id, req.body, { new: true });
    if (!route) return res.status(404).json({ message: "Route not found" });

    res.status(200).json(route);
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Failed to update route" });
  }
};

// 🟢 Delete route safely
export const deleteBusRoute = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid route ID" });

    const route = await BusRoute.findByIdAndDelete(id);
    if (!route) return res.status(404).json({ message: "Route not found" });

    res.status(200).json({ message: "Route deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Failed to delete route" });
  }
};
