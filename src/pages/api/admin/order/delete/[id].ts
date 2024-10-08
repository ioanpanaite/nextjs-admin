import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import OrderModel from "src/lib/models/Order.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "DELETE") {
    res.status(405).send('Not correct request type')
  }

  const { id } = req.query;

  try {
    await connectDB();

    await OrderModel.deleteOne({ id: id })

    res.status(200).json({ ok: true, message: 'Order deleted successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Order Deleting: Something went wrong." });
  }
}