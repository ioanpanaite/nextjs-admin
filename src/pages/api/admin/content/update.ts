import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import ContentModel from "src/lib/models/Content.model";

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
    const content = await ContentModel.findOne()

    if (content) {
      await ContentModel.updateOne({ _id: content._id }, { ...data })
    } else {
      await ContentModel.create(data)
    }

    res.status(200).json({ ok: true, message: 'Content updated successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Content Creation: Something went wrong." });
  }
}