import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["hospital", "taxi", "clinic", "helpline"], required: true },
  contact: { type: String },
  address: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
});

export default mongoose.model("Location", locationSchema);
