import express from "express";
import {
  getBusRoutes,
  getBusRouteById,
  addBusRoute,
  updateBusRoute,
  deleteBusRoute,
  addSubRoute,
  updateSubRoute,
  deleteSubRoute,
} from "../controllers/busController.js";

const router = express.Router();

// Main route operations
router.get("/", getBusRoutes);
router.get("/:id", getBusRouteById);
router.post("/", addBusRoute);
router.put("/:id", updateBusRoute);
router.delete("/:id", deleteBusRoute);

// Sub-route operations
router.post("/:id/subroutes", addSubRoute);
router.put("/:id/subroutes/:subRouteId", updateSubRoute);
router.delete("/:id/subroutes/:subRouteId", deleteSubRoute);

export default router;
