import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    delivery_days: {
      type: mongoose.Schema.Types.Mixed,
    },
    geometry: {
      type: mongoose.Schema.Types.Mixed,
    },
    min_order: {
      type: Number
    },
    name: {
      type: String
    },
  },
  {
    collection: 'Delivery',
    timestamps: true
  }
)

export default mongoose.models.Delivery || mongoose.model('Delivery', schema)