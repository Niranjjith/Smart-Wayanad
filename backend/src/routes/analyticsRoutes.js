import express from "express";
import {
  getAlertPredictions,
  getSmartRouteRecommendations,
  detectAnomalies,
  getDashboardAnalytics,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/alerts/predictions", getAlertPredictions);
router.get("/routes/recommendations", getSmartRouteRecommendations);
router.get("/alerts/anomalies", detectAnomalies);
router.get("/dashboard", getDashboardAnalytics);

export default router;




