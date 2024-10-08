import { NextApiRequest, NextApiResponse } from "next/types";
import { Status } from "src/context/types";
import connectDB from "src/lib/connectDB";
import OrderModel from "src/lib/models/Order.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).send('Not correct request type')
  }


  try {
    const { data } = req.body;
    await connectDB();

    await OrderModel.updateOne(
      { id: data.orderId },
      {
        orderStatus: Status.Refunded,
        refundReason: data.reason
      }
    )

    res.status(200).json({ ok: true, message: 'Order refund!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Order updating: Something went wrong." });
  }
}