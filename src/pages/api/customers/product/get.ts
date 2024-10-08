import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import CustomerModel from "src/lib/models/Customer.model";
import ProductModel from "src/lib/models/Product.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { search, type } = req.query ?? ''

    await connectDB();
    let products = []
    if (type === 'id') {
      const productAll = await ProductModel.find({ customerId: search })
      products = productAll.flatMap(val => val._id && { ...val._doc, id: val._id.toString() })
    } else if (type === 'site') {
      const customer = await CustomerModel.findOne({ siteName: search })
      if(customer != undefined) {
        const productAll = await ProductModel.find({ customerId: customer._id.toString() })
        products = productAll.flatMap(val => val._id && { ...val._doc, id: val._id.toString() })
      }
    }

    res.status(200).json({ ok: true, info: { data: products } });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: error + "Profile Get: Something went wrong." });
  }
}