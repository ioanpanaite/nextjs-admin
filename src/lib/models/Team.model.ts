import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    memberEmail: {
      type: String,
    },
    role: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    collection: 'Team',
    timestamps: true
  }
)

export default mongoose.models.Team || mongoose.model('Team', schema)