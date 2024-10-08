import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import RoomModel from "src/lib/models/Room.model";
import UserModel from "src/lib/models/User.model";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  const { id } = req.query;

  try {
    const session = await getServerSession(req, res, authOptions)
    await connectDB();

    const rooms = await RoomModel.find({ roomId: id })
    if (rooms && rooms.length > 0) {
      const room = rooms.find(val => val.userId !== session?.user?.id)

      res.status(200).json({ ok: true, result: room });
    } else {
      res.status(200).json({ ok: true, result: null });
    }

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Profile Get: Something went wrong." });
  }
}