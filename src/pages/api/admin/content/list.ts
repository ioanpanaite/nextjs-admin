import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import ContentModel from "src/lib/models/Content.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    await connectDB();

    const content = await ContentModel.findOne()
    const result = {
      allData: content,
      globalContent: content.GlobalContent,
      homeContent: content.HomeContent
    }

    res.status(200).json({ ok: true, result: result });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Content Creation: Something went wrong." });
  }
}