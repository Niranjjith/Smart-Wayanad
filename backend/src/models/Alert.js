import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, default: "pending" },

    // GEOJSON LOCATION
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
  },
  { timestamps: true }
);

alertSchema.index({ location: "2dsphere" });

export default mongoose.model("Alert", alertSchema);
