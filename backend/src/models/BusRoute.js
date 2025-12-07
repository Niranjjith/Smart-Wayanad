import mongoose from "mongoose";

const subRouteSchema = new mongoose.Schema(
  {
    subRouteNo: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    firstBus: { type: String, default: "" },
    lastBus: { type: String, default: "" },
    frequencyMin: { type: String, default: "" },
    via: { type: String, default: "" }, 
  },
  { timestamps: true }
);

const busRouteSchema = new mongoose.Schema(
  {
    routeNo: { type: String, required: true, unique: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    firstBus: { type: String, default: "" },
    lastBus: { type: String, default: "" },
    frequencyMin: { type: String, default: "" },
    description: { type: String, default: "" },
    subRoutes: [subRouteSchema], 
    isActive: { type: Boolean, default: true },
    // Road status: 'normal', 'under_construction', 'maintenance', 'blocked', 'slow'
    roadStatus: { 
      type: String, 
      enum: ['normal', 'under_construction', 'maintenance', 'blocked', 'slow'],
      default: 'normal' 
    },
    roadStatusMessage: { type: String, default: "" },
    // Route quality metrics
    estimatedTime: { type: Number, default: 0 }, // in minutes
    distance: { type: Number, default: 0 }, // in km
    popularity: { type: Number, default: 0 }, // 0-100 score
    // Alternative names for better search
    alternativeNames: [String],
  },
  { timestamps: true }
);

export default mongoose.model("BusRoute", busRouteSchema);
