import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import PromotionModel from "src/lib/models/Promotion.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).send('Not correct request type')
  }

  const { data } = req.body;
  try {
    await connectDB();

    await PromotionModel.updateOne({ _id: data.id }, {
      $set: {
        ...data
      }
    })

    res.status(200).json({ ok: true, message: 'Promotion updated successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Promotion: Something went wrong." });
  }
}