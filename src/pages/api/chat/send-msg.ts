import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import ChatsModel from "src/lib/models/Chats.model";
import RoomModel from "src/lib/models/Room.model";
import { authOptions } from "../auth/[...nextauth]";

type NewMessageData = {
  senderId: string
  message: string
  time: string
  feedback: {
    isSent: boolean
    isSeen: boolean
    isDelivered: boolean
  }
}

type ActiveChatType = {
  id: string
  userId: string
  unseenMsgs: number
  chats: Array<NewMessageData>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).send('Not correct request type')
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    const { data } = req.body
    const { body } = data.obj.data

    await connectDB()

    const newMessageData: NewMessageData = {
      senderId: session?.user?.id || '',
      message: body.message,
      time: (new Date()).toISOString(),
      feedback: {
        isSent: false,
        isSeen: false,
        isDelivered: false
      }
    }

    if (body.chat.senderId === session?.user?.id) {
      const chat = await ChatsModel.findOne({ id: body.chat.id })
      if (chat) {
        chat.chats.push(newMessageData)
        await ChatsModel.updateOne({ id: body.chat.id }, { chats: chat.chats, unseenMsgs: chat.unseenMsgs + 1 })
      } else {
        const chats: ActiveChatType = {
          id: body.chat.id,
          userId: body.chat.userId,
          unseenMsgs: 1,
          chats: [newMessageData]
        }
        await ChatsModel.create(chats)
      }
    }

    const activeChat: ActiveChatType = {
      id: body.chat.id,
      userId: session?.user?.id || '',
      unseenMsgs: 1,
      chats: []
    }
    const room = await RoomModel.findOne({ roomId: body.chat.id })

    if (!room) {
      await RoomModel.create({ roomId: body.chat.id, users: [body.chat.userId, session?.user?.id] })
      activeChat.chats = [newMessageData]
    } else {
      const chat = await ChatsModel.findOne({ id: body.chat.id })
      activeChat.chats = chat?.chats
    }

    const response = { activeChat, id: body.chat.id }

    res.status(200).json({ ok: true, result: { response } });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Chat server is not working." });
  }
}
