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

// 🟢 Get single route by ID
export const getBusRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid route ID" });

    const route = await BusRoute.findById(id);
    if (!route) return res.status(404).json({ message: "Route not found" });

    res.status(200).json(route);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch bus route" });
  }
};

// 🟢 Add new route
export const addBusRoute = async (req, res) => {
  try {
    const { routeNo, origin, destination, firstBus, lastBus, frequencyMin, description, subRoutes } = req.body;

    if (!routeNo || !origin || !destination)
      return res.status(400).json({ message: "Route No, Origin, Destination required" });

    const route = await BusRoute.create({
      routeNo,
      origin,
      destination,
      firstBus,
      lastBus,
      frequencyMin,
      description: description || "",
      subRoutes: subRoutes || [],
    });

    res.status(201).json(route);
  } catch (err) {
    console.error("❌ Add error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Route number already exists" });
    }
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

    const route = await BusRoute.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
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

// 🟢 Add sub-route to a route
export const addSubRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const subRouteData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid route ID" });

    if (!subRouteData.subRouteNo || !subRouteData.origin || !subRouteData.destination)
      return res.status(400).json({ message: "Sub-route number, origin, and destination are required" });

    const route = await BusRoute.findById(id);
    if (!route) return res.status(404).json({ message: "Route not found" });

    route.subRoutes.push(subRouteData);
    await route.save();

    res.status(201).json(route);
  } catch (err) {
    console.error("❌ Add sub-route error:", err);
    res.status(500).json({ message: "Failed to add sub-route" });
  }
};

// 🟢 Update sub-route
export const updateSubRoute = async (req, res) => {
  try {
    const { id, subRouteId } = req.params;
    const subRouteData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(subRouteId))
      return res.status(400).json({ message: "Invalid route or sub-route ID" });

    const route = await BusRoute.findById(id);
    if (!route) return res.status(404).json({ message: "Route not found" });

    const subRoute = route.subRoutes.id(subRouteId);
    if (!subRoute) return res.status(404).json({ message: "Sub-route not found" });

    Object.assign(subRoute, subRouteData);
    await route.save();

    res.status(200).json(route);
  } catch (err) {
    console.error("❌ Update sub-route error:", err);
    res.status(500).json({ message: "Failed to update sub-route" });
  }
};

// 🟢 Delete sub-route
export const deleteSubRoute = async (req, res) => {
  try {
    const { id, subRouteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(subRouteId))
      return res.status(400).json({ message: "Invalid route or sub-route ID" });

    const route = await BusRoute.findById(id);
    if (!route) return res.status(404).json({ message: "Route not found" });

    route.subRoutes.id(subRouteId)?.remove();
    await route.save();

    res.status(200).json(route);
  } catch (err) {
    console.error("❌ Delete sub-route error:", err);
    res.status(500).json({ message: "Failed to delete sub-route" });
  }
};
