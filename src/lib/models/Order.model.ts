import mongoose, { Schema } from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true
    },
    issuedDate: {
      type: Date,
    },
    address: {
      type: String,
    },
    company: {
      type: String,
    },
    email: {
      type: String,
      required: true
    },
    contact: {
      type: String,
    },
    country: {
      type: String,
    },
    total: {
      type: Number,
      required: true
    },
    avatar: {
      type: String
    },
    orderStatus: {
      type: String,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    orderNote: {
      type: String
    },
    subTotal: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    product: {
      type: Array,
    },
    refundReason: {
      type: String
    },
    supplierId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true
    },
  },
  {
    collection: 'Orders',
    timestamps: true
  }
)

export default mongoose.models.Orders || mongoose.model('Orders', schema)