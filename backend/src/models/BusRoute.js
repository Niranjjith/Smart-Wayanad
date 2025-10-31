import mongoose from "mongoose";

const busRouteSchema = new mongoose.Schema(
  {
    routeNo: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    firstBus: { type: String, default: "" },
    lastBus: { type: String, default: "" },
    frequencyMin: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("BusRoute", busRouteSchema);
