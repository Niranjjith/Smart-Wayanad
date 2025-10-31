import express from "express";
import {
  getBusRoutes,
  addBusRoute,
  updateBusRoute,
  deleteBusRoute,
} from "../controllers/busController.js";

const router = express.Router();

router.get("/", getBusRoutes);
router.post("/", addBusRoute);
router.put("/:id", updateBusRoute);
router.delete("/:id", deleteBusRoute);

export default router;
