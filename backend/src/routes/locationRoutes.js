import express from "express";
import { getAllLocations, addLocation, getByType } from "../controllers/locationController.js";

const router = express.Router();

router.get("/", getAllLocations);
router.post("/", addLocation);
router.get("/:type", getByType); // e.g. /api/location/hospital

export default router;
