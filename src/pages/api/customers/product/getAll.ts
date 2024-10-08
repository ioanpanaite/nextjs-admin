import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import ProductModel from "src/lib/models/Product.model";
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
    const productAll = await ProductModel.find({ supplierEmail: email })
    const products = productAll.flatMap(val => val._id && { ...val._doc, id: val._id.toString() })

    res.status(200).json({ ok: true, info: { data: products } });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Profile Get: Something went wrong." });
  }
}