import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";
import { genSaltSync, hashSync } from "bcrypt-ts";

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

    const user = await UserModel.findById(id)

    const result = {
      id: user._id.toString(),
      email: user.email,
      notifyEmail: user.notifyEmail
    }

    res.status(200).json({ ok: true, result });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Profile Get: Something went wrong." });
  }
}