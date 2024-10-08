import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    await connectDB()
    const users = await UserModel.find()

    const clients = users.map((user: any) => {
      const { address, company, email, country, contact, username } = user

      return {
        username,
        address,
        company,
        country,
        contact,
        email
      }
    })

    res.status(200).json({ ok: true, data: clients });
  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Order clients is not working." });
  }
}