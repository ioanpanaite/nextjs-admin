import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  {
    collection: 'Category',
    timestamps: true
  }
)

export default mongoose.models.Category || mongoose.model('Category', schema)