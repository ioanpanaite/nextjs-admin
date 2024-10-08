import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";
import { Role } from "src/context/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import CompanyModel from "src/lib/models/Company.model";

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
    const company = await CompanyModel.findOne({ email: email })

    const result = {
      data: company
    }

    res.status(200).json({ ok: true, info: result });
    res.end()

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Profile Get: Something went wrong." });
  }
}