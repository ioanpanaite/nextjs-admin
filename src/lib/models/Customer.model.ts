import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    supplierEmail: {
      type: String,
      required: true
    },
    avatarImage: {
      type: String,
    },
    siteName: {
      type: String,
    },
    deliveryAddress: {
      type: String
    },
    accountId: {
      type: String
    },
    username: {
      type: String
    },
    email: {
      type: String
    },
    contact: {
      type: String
    },
    blocked: {
      type: String
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    collection: 'Customer',
    timestamps: true
  }
)

export default mongoose.models.Customer || mongoose.model('Customer', schema)