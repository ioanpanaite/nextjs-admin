import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    ruleValidDate: {
      type: String,
    },
    percentAmount: {
      type: String,
    },
    status: {
      type: String
    }
  },
  {
    collection: 'Promotions',
    timestamps: true
  }
)

export default mongoose.models.Promotions || mongoose.model('Promotions', schema)