import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    message: { type: String, required: true },
    response: { type: String },
    intent: { type: String, default: "general" },
    confidence: { type: Number, default: 0.8 },
    sentiment: { type: String, enum: ["positive", "neutral", "negative"], default: "neutral" },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
