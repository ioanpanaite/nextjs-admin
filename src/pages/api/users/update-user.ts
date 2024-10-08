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

    if (data?.password) {
      const salt = genSaltSync(10);
      const hashedPassword = hashSync(data.password, salt);
      await UserModel.updateOne(
        { _id: data.id },
        { password: hashedPassword }
      )
    } else {
      await UserModel.updateOne(
        { _id: data.id },
        {
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          role: data.role,
          status: data.status,
          currentPlan: data.currentPlan
        }
      )
    }

    res.status(200).json({ ok: true, message: 'User updated successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "User Updating: Something went wrong." });
  }
}