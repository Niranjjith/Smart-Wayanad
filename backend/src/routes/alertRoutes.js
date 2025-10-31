import express from "express";
import { createAlert, getAlerts, updateAlert, deleteAlert } from "../controllers/alertController.js";
const router = express.Router();
router.get("/", getAlerts);
router.post("/", createAlert);
router.put("/:id", updateAlert);
router.delete("/:id", deleteAlert);
export default router;
