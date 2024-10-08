import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { data } = req.body;
    const session = await getServerSession(req, res, authOptions)
    const email = session?.user.email

    await connectDB();
    const result = await UserModel.updateOne(
      { email: email },
      { ...data }
    )

    res.status(200).json({ ok: true, message: 'Supplier social updated successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Supplier Updating: Something went wrong." });
  }
}