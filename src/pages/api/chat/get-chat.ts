import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import ChatsModel from "src/lib/models/Chats.model";
import RoomModel from "src/lib/models/Room.model";
import UserModel from "src/lib/models/User.model";
import { getRoomId } from "src/lib/utils";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).send('Not correct request type')
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    // This id will be roomId or userId
    // If user select user in contact section, it will be userId
    // If conversation section, it will be roomId
    const { id } = req.query
    if (!id) {
      res.status(422).json({ ok: false, message: "Chat server is not working." });

      return;
    }

    await connectDB()
    const chatData = await ChatsModel.findOne({ id: id })
    const room = await RoomModel.findOne({ roomId: id })
    const roomId = getRoomId()

    chatData.chats.map((item: any) => {
      if (item.senderId != session?.user?.id) {
        item.feedback.isSeen = true;
      }
    })
    await ChatsModel.updateOne({ id: id }, { chats: chatData.chats });

    const chat = { id: roomId, userId: id, senderId: session?.user?.id, unseenMsgs: 0, chat: chatData?.chats || [] }
    let contact = null
    if (room) {
      const userId = room?.users?.find((val: any) => val !== session?.user?.id)

      chat.id = room.roomId
      chat.userId = userId

      const user = await UserModel.findOne({ _id: userId })
      contact = {
        id: user._id.toString(),
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        status: 'online',
      }
    } else {
      const user = await UserModel.findOne({ _id: id })
      contact = {
        id: user._id.toString(),
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        status: 'online',
      }
    }

    if (chat) chat.unseenMsgs = 0
    res.status(200).json({ ok: true, result: { chat, contact } });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Chat server is not working." });
  }
}
