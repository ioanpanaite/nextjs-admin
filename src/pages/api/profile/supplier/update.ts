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
    const result = await UserModel.updateOne(
      { email: data.email },
      { ...data }
    )

    res.status(200).json({ ok: true, message: 'Supplier updated successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Supplier Updating: Something went wrong." });
  }
}