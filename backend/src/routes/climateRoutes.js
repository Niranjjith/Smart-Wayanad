// backend/src/routes/climateRoutes.js
import express from "express";
import { getClimate } from "../controllers/climateController.js";

const router = express.Router();

// Route → GET /api/climate/current
router.get("/current", getClimate);

export default router;
