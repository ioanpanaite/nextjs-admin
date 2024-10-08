import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    GlobalContent: {
      type: mongoose.Schema.Types.Mixed,
    },
    HomeContent: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    collection: 'Content',
    timestamps: true
  }
)

export default mongoose.models.Content || mongoose.model('Content', schema)