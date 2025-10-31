import express from "express";
import { getClimate } from "../controllers/climateController.js";
const router = express.Router();
router.get("/current", getClimate);
export default router;
