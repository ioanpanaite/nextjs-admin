import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import CompanyModel from "src/lib/models/Company.model";

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
    await CompanyModel.findOneAndUpdate(
      { email: email },
      { ...data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    res.status(200).json({ ok: true, message: 'Supplier company details updated successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Supplier Updating: Something went wrong." });
  }
}