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

  try {
    const { data } = req.body;
    if (data.action === 'Publish') {
      const filter = data.list.map((v: string) => {
        return { _id: v }
      })

      await connectDB();
      await CatalogueModel.updateMany(
        { $or: filter },
        {
          $set: {
            visible: true
          }
        }
      )
    } else if (data.action === 'Unpublish') {
      const filter = data.list.map((v: string) => {
        return { _id: v }
      })

      await connectDB();
      await CatalogueModel.updateMany(
        { $or: filter },
        {
          $set: {
            visible: false
          }
        }
      )
    } else if (data.action === 'Delete') {
      const filter = data.list.map((v: string) => {
        return { _id: v }
      })

      await connectDB();
      await CatalogueModel.deleteMany({ $or: filter })
    }

    res.status(200).json({ ok: true, message: 'Catalogue bulk proceed!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Catalogue: Something went wrong." });
  }
}