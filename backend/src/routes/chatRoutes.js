import express from "express";
import { getChatLogs, createChatMessage } from "../controllers/chatController.js";
const router = express.Router();
router.get("/", getChatLogs);
router.post("/", createChatMessage);
export default router;
