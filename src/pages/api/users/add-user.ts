import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";

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

    await UserModel.create(data)

    // Password adding logic should be added in here
    // Users will be set their password by email link
    res.status(200).json({ ok: true, message: 'User added successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "User Creation: Something went wrong." });
  }
}