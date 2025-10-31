import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: String,
    message: String,
    reply: String,
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatSchema);
