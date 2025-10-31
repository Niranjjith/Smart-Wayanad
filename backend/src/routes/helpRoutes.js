import express from "express";
import { sendHelp, getAllHelpRequests, updateHelpStatus } from "../controllers/climateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", sendHelp);
router.get("/", protect, getAllHelpRequests);
router.put("/:id", protect, updateHelpStatus);

export default router;
