import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import CatalogueModel from "src/lib/models/Catalogue.model";
import CategoryModel from "src/lib/models/Category.model";
import UserModel from "src/lib/models/User.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const { email } = req.query ?? ''

    if (email) {
      await connectDB();
      const categoryData = await CategoryModel.findOne({ email: email });
      const selected = await UserModel.findOne({ email: email });

      res.status(200).json({ ok: true, info: { category: categoryData.category, selected: selected.categories } });
    }
    res.end()
  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Sign up API server is not working." });
  }
}