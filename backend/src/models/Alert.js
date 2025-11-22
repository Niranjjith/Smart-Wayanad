import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, default: "pending" },
    alertType: { 
      type: String, 
      enum: ["emergency", "earthquake", "tsunami", "flood", "landslide", "fire", "medical", "other"],
      default: "emergency" 
    },
    source: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" 
    },
    priority: { 
      type: String, 
      enum: ["low", "medium", "high", "critical"], 
      default: "medium" 
    },

    // GEOJSON LOCATION (optional for admin alerts)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: false,
        default: undefined, // Explicitly no default
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: false,
        default: undefined, // Explicitly no default
        validate: {
          validator: function(v) {
            // If coordinates are provided, must be an array of 2 numbers
            if (v == null || v === undefined) return true; // Allow null/undefined
            return Array.isArray(v) && v.length === 2 && 
                   typeof v[0] === 'number' && typeof v[1] === 'number';
          },
          message: 'Coordinates must be an array of 2 numbers [lng, lat]'
        }
      },
    },
  },
  { timestamps: true }
);

// Pre-save hook to remove location field if it doesn't have coordinates
alertSchema.pre('save', function(next) {
  // If source is admin, ensure location is completely removed
  if (this.source === 'admin') {
    this.set('location', undefined, { strict: false });
    this.unset('location');
  }
  // If location exists but has no coordinates, remove it entirely
  else if (this.location && (!this.location.coordinates || 
           this.location.coordinates.length === 0 || 
           !Array.isArray(this.location.coordinates))) {
    this.set('location', undefined, { strict: false });
    this.unset('location');
  }
  next();
});

// Pre-update hook for findOneAndUpdate, updateOne, etc.
alertSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
  const update = this.getUpdate();
  // If source is admin or location has no coordinates, remove location
  if (update && (update.source === 'admin' || 
      (update.location && (!update.location.coordinates || update.location.coordinates.length === 0)))) {
    this.set({ location: undefined });
  }
  next();
});

// Sparse index for location - only indexes documents with location coordinates
alertSchema.index({ location: "2dsphere" }, { sparse: true });
alertSchema.index({ createdAt: -1 });
alertSchema.index({ alertType: 1 });

export default mongoose.model("Alert", alertSchema);
