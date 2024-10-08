import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import CustomerModel from "src/lib/models/Customer.model";
import OrderModel from "src/lib/models/Order.model";
import ProductModel from "src/lib/models/Product.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { id } = req.query ?? ''

    // Getting order data from db
    await connectDB()
    const order = await OrderModel.findOne({ id: id });

    const customer = await CustomerModel.findOne({ email: order.email })
    if (customer) {
      const products = await ProductModel.find({ customerId: customer._id.toString() })
      order.product = products
    }

    const responseData = { order }
    res.status(200).json({ ok: true, data: responseData });
    res.end();
  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Order is not working." });
  }
}