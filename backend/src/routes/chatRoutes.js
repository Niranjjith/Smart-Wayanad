import express from "express";
import {
  getChats,
  sendChat,
  updateChat,
  deleteChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/", getChats);
router.post("/", sendChat);
router.put("/:id", updateChat); // ✏️ Edit
router.delete("/:id", deleteChat); // 🗑 Delete

export default router;
