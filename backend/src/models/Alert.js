import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    message: String,
    location: {
      lat: Number,
      lng: Number,
    },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);
