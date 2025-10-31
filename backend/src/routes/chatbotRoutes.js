import express from "express";
import { chatbotReply } from "../controllers/chatbotController.js";
const router = express.Router();

router.post("/", chatbotReply);

export default router;
