import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import OrderModel from "src/lib/models/Order.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).send('Not correct request type')
  }

  const { data } = req.body;

  try {
    await connectDB();

    await OrderModel.create(data)

    res.status(200).json({ ok: true, message: 'Order added successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Order Creation: Something went wrong." });
  }
}