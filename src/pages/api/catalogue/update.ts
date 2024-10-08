import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import CatalogueModel from "src/lib/models/Catalogue.model";

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
    await CatalogueModel.updateOne(
      { _id: data.id },
      {
        $set: {
          ...data
        }
      }
    )

    res.status(200).json({ ok: true, message: 'Catalogue updated successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Catalogue: Something went wrong." });
  }
}