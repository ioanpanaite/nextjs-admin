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
    if (data._id) {
      await CustomerModel.updateOne(
        { _id: data._id },
        {
          blocked: data.blocked,
        }
      );
      let message = 'Customer Blocked!';
      let status = 'warning';
      if (data.blocked != '1') {
        message = 'Customer Unblocked!';
        status = 'success';
      }
      res.status(200).json({ ok: true, message: message, status: status });
    }

    res.end();

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: error + "Product: Something went wrong." });
  }
}