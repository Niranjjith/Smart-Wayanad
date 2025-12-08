import mongoose from "mongoose";

const climateSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, default: "Wayanad" },
    temp: { type: Number, required: true },
    feelsLike: { type: Number },
    humidity: { type: Number, required: true },
    wind: { type: Number, required: true },
    windDirection: { type: String },
    pressure: { type: Number },
    visibility: { type: Number },
    uvIndex: { type: Number },
    description: { type: String, required: true },
    icon: { type: String },
    code: { type: Number },
    sunrise: { type: String },
    sunset: { type: String },
    forecast: [
      {
        date: { type: String },
        temp: { type: Number },
        minTemp: { type: Number },
        maxTemp: { type: Number },
        description: { type: String },
        icon: { type: String },
        humidity: { type: Number },
        wind: { type: Number },
      },
    ],
    alerts: [
      {
        type: { type: String }, // "warning", "advisory", "watch"
        title: { type: String },
        description: { type: String },
        severity: { type: String }, // "low", "moderate", "high", "extreme"
        startTime: { type: Date },
        endTime: { type: Date },
      },
    ],
    coordinates: {
      lat: { type: Number },
      lon: { type: Number },
    },
  },
  { timestamps: true }
);

// Index for faster queries
climateSchema.index({ city: 1, createdAt: -1 });

export default mongoose.model("Climate", climateSchema);


