import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";
import { Role } from "src/context/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { email } = req.query ?? ''
    await connectDB();
    const user = await UserModel.findOne({ $and: [{ email: email }, { role: Role.Supplier }] })

    const result = {
      id: user._id.toString(),
      email: user.email,
      notifyEmail: user.notifyEmail,
      businessName: user.businessName,
      businessDesc: user.businessDesc,
      businessAddress: user.businessAddress,
      businessPhone: user.businessPhone,
      businessPhoneCode: user.businessPhoneCode,
    }

    res.status(200).json({ ok: true, result });
    res.end()

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Profile Get: Something went wrong." });
  }
}