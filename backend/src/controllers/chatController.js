import Chat from "../models/Chat.js";

// 🔹 Get all chat logs
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error("❌ getChats error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Send new chat
export const sendChat = async (req, res) => {
  try {
    const { user, message } = req.body;
    if (!user || !message) {
      return res.status(400).json({ message: "User and message required" });
    }

    const response =
      message.toLowerCase().includes("hi") ||
      message.toLowerCase().includes("hello")
        ? "Hello! How can I assist you today?"
        : "Thank you for reaching out. Our team will respond shortly.";

    const chat = await Chat.create({ user, message, response });
    res.status(201).json(chat);
  } catch (err) {
    console.error("❌ sendChat error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Update (edit) chat message
export const updateChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(chat);
  } catch (err) {
    console.error("❌ updateChat error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Delete chat
export const deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ deleteChat error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
