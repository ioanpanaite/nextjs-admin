import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import CustomerModel from "src/lib/models/Customer.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { data } = req.body;
    await connectDB();
    if (data.id) {
      await CustomerModel.updateOne(
        { _id: data.id },
        {
          username: data.name,
          email: data.email,
          contact: data.phone,
          siteName: data.siteName,
          deliveryAddress: data.deliveryAddress,
          accountId: data.accountId,
        }
      )
      const customer = await CustomerModel.findOne({ _id: data.id });
      res.status(200).json({ ok: true, message: 'Customer updated successfully!' , info: customer});
    }

    res.end();

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: error + "Product: Something went wrong." });
  }
}