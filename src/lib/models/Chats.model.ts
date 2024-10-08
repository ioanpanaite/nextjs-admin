import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    unseenMsgs: {
      type: Number
    },
    chats: {
      type: Array,
    }
  },
  {
    collection: 'Chats',
    timestamps: true
  }
)

export default mongoose.models.Chats || mongoose.model('Chats', schema)