import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";
import { Role } from "src/context/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    const email = session?.user.email
    await connectDB();
    const user = await UserModel.findOne({ $and: [{ email: email }, { role: Role.Supplier }] })

    const result = {
      instagram: user.instagram,
      linkedin: user.linkedin,
      twitter: user.twitter,
    }

    res.status(200).json({ ok: true, info: { data: result } });
    res.end()

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Profile Get: Something went wrong." });
  }
}