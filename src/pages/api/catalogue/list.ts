import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import CatalogueModel from "src/lib/models/Catalogue.model";

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
    const catalogue = await CatalogueModel.find().sort({ '_id': -1 });
    const allData = catalogue.flatMap((val) => val._id && { ...val._doc, id: val._id.toString() });

    const filteredData = allData.filter(catalogue =>
    (catalogue.product_name?.toLowerCase().includes(queryLowered) ||
      catalogue.description?.toLowerCase().includes(queryLowered) ||
      catalogue.product_code?.toLowerCase().includes(queryLowered))
    )

    const catalogueData = {
      allData,
      data: filteredData,
      params: req.query,
      total: allData.length
    }

    res.status(200).json({ ok: true, result: catalogueData });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Sign up API server is not working." });
  }
}