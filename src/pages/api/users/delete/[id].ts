import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import UserModel from "src/lib/models/User.model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "DELETE") {
    res.status(405).send('Not correct request type')
  }

  const { id } = req.query;
  try {
    await connectDB();

    const user = await UserModel.findById(id);
    if (!user) {
      res.status(422).json({ ok: false, message: "User doesn't exist." });
    }

    // Delete user permanantly by id
    await UserModel.deleteOne({ _id: id })

    res.status(200).json({ ok: true, message: 'User deleted successfully!' });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "User Deleting: Something went wrong." });
  }
}