import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import CustomerModel from "src/lib/models/Customer.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { _id = '' } = req.query ?? ''
    await connectDB();
    const customer = await CustomerModel.findOne({ _id: _id })

    res.status(200).json({ ok: true, customer: customer });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: error + "Profile Get: Something went wrong." });
  }
}