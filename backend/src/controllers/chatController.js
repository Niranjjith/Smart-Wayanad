import ChatMessage from "../models/ChatMessage.js";

export async function getChatLogs(req, res) {
  res.json(await ChatMessage.find().sort({ createdAt: -1 }));
}

export async function createChatMessage(req, res) {
  res.status(201).json(await ChatMessage.create(req.body));
}
