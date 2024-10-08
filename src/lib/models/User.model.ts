import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    currentPlan: {
      type: String,
      required: true
    },
    rememberMe: {
      type: Boolean
    },
    address: {
      type: String,
    },
    company: {
      type: String,
    },
    country: {
      type: String,
    },
    contact: {
      type: String,
    },
    notifyEmail: {
      type: String,
    },
    businessName: {
      type: String,
    },
    businessDesc: {
      type: String,
    },
    businessAddress: {
      type: String,
    },
    businessPhone: {
      type: String,
    },
    businessPhoneCode: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    twitter: {
      type: String,
    },
    supplierImage: {
      type: String
    },
    supplierCover: {
      type: String
    },
    categories: {
      type: String
    }
  },
  {
    collection: 'Users',
    timestamps: true
  }
)

export default mongoose.models.Users || mongoose.model('Users', schema)