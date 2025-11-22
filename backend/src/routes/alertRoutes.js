import express from "express";
import { createAlert, getAlerts, updateAlert, deleteAlert, createAdminAlert } from "../controllers/alertController.js";
const router = express.Router();
router.get("/", getAlerts);
router.post("/", createAlert);
router.post("/admin", createAdminAlert); // Admin broadcast alert
router.put("/:id", updateAlert);
router.delete("/:id", deleteAlert);
export default router;
