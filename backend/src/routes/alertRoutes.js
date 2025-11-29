import express from "express";
import { createAlert, getAlerts, updateAlert, deleteAlert, createAdminAlert, updateLiveLocation } from "../controllers/alertController.js";
const router = express.Router();
router.get("/", getAlerts);
router.post("/", createAlert);
router.post("/admin", createAdminAlert); // Admin broadcast alert
router.post("/live-location", updateLiveLocation); // Live location updates
router.put("/:id", updateAlert);
router.delete("/:id", deleteAlert);
export default router;
