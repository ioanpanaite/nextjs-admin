import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import CategoryModel from "src/lib/models/Category.model";

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
    await CategoryModel.findOneAndUpdate(
      { email: data.email },
      { ...data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    res.status(200).json({ ok: true, message: 'Category added successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Category: Something went wrong." });
  }
}