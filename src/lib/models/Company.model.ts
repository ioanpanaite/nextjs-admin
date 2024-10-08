import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    foundedIn: {
      type: String,
      required: true
    },
    basedIn: {
      type: String,
      required: true
    },
    shipsFrom: {
      type: String,
      required: true
    },
    productMadeIn: {
      type: String
    },
    leadTime: {
      type: String
    },
    minOrder: {
      type: String
    },
    values: {
      type: String
    },
    productCover: {
      type: String
    },
    productTitle: {
      type: String
    },
    productText: {
      type: String
    }
  },
  {
    collection: 'Company',
    timestamps: true
  }
)

export default mongoose.models.Company || mongoose.model('Company', schema)