import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    message: { type: String, required: true },
    response: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
