import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
    contact: String,
    lat: String,
    lng: String,
    extraInfo: String,
  },
  { timestamps: true }
);

export default mongoose.model("Location", locationSchema);
