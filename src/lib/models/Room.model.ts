import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true
    },
    users: {
      type: Array,
    },
  },
  {
    collection: 'Room',
    timestamps: true
  }
)

export default mongoose.models.Room || mongoose.model('Room', schema)