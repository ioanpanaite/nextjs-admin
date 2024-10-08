import mongoose, { Schema } from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    customerId: {
      type: String
    },
    supplierEmail: {
      type: String
    },
    orderId: {
      type: Schema.Types.ObjectId,
    },
    code: {
      type: String,
    },
    name: {
      type: String
    },
    image: {
      type: String
    },
    unit: {
      type: String,
      required: true
    },
    quantity: {
      type: Number
    },
    price: {
      type: String,
      required: true
    }
  },
  {
    collection: 'Product',
    timestamps: true
  }
)

export default mongoose.models.Product || mongoose.model('Product', schema)