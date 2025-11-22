import express from "express";
import { chatbotReply, getChatAnalytics } from "../controllers/chatbotController.js";
const router = express.Router();

router.post("/", chatbotReply);
router.get("/analytics", getChatAnalytics);

export default router;
