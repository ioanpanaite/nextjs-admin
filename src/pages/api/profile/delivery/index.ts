import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";
import { genSaltSync, hashSync } from "bcrypt-ts";
import DeliveryModel from "src/lib/models/Delivery.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  const { id } = req.query;

  try {
    await connectDB();

    const delivery = await DeliveryModel.findById(id)

    const result = {
      id: delivery._id.toString(),
    }

    res.status(200).json({ ok: true, result });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Delivery Get: Something went wrong." });
  }
}