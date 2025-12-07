// backend/src/routes/climateRoutes.js
import express from "express";
import {
  getClimate,
  getForecast,
  getHistory,
  getAlerts,
  getStats,
} from "../controllers/climateController.js";

const router = express.Router();

// Route → GET /api/climate/current
router.get("/current", getClimate);
router.get("/forecast", getForecast);
router.get("/history", getHistory);
router.get("/alerts", getAlerts);
router.get("/stats", getStats);

export default router;
