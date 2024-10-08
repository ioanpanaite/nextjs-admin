import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import PromotionModel from "src/lib/models/Promotion.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { q = '' } = req.query ?? ''

    const queryLowered = (q as string).toLowerCase()

    await connectDB();
    const promotion = await PromotionModel.find();
    const allData = promotion.flatMap((val) => val._id && { ...val._doc, id: val._id.toString() });
    const filteredData = allData.filter(
      promo =>
      (promo.title.toLowerCase().includes(queryLowered) ||
        promo.description.toLowerCase().includes(queryLowered))
    )

    const promoData = {
      allData,
      data: filteredData,
      params: req.query,
      total: allData.length
    }

    res.status(200).json({ ok: true, result: promoData });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Sign up API server is not working." });
  }
}