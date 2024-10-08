import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";
import { genSaltSync, hashSync } from "bcrypt-ts";

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

    await UserModel.updateOne({ _id: data.id }, { notifyEmail: data.email })

    res.status(200).json({ ok: true, message: "Profile notification email set successfully." });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Profile notification: Something went wrong." });
  }
}