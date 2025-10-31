import mongoose from "mongoose";

const helpSchema = new mongoose.Schema({
  name: String,
  phone: String,
  location: {
    lat: Number,
    lng: Number,
  },
  message: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Help", helpSchema);
