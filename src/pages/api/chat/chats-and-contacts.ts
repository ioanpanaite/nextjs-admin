import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next/types";
import connectDB from "src/lib/connectDB";
import ChatsModel from "src/lib/models/Chats.model";
import RoomModel from "src/lib/models/Room.model";
import UserModel from "src/lib/models/User.model";
import { ChatType } from "src/types/apps/chatTypes";
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

    await connectDB()
    const users = await UserModel.find()
    const filterContacts = users.map(user => {
      return {
        id: user._id.toString(),
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        status: 'online',
      }
    })
    const contacts = filterContacts.filter(user => user.id !== session?.user?.id)

    const rooms = await RoomModel.find()
    const chats = await ChatsModel.find()

    const filterRoom = rooms.map((room) => {
      const selectedContact = room.users.find((user: string) => user === session?.user?.id)

      // console.log("222222222222", selectedContact)
      if (selectedContact) {
        const chat = chats.find((chat: any) => chat.id === room.roomId)
        const id = session?.user?.id as string | number
        const filteredChats = chat?.chats?.find((val: ChatType) => val?.senderId !== id);

        const lastMessage = filteredChats ? filteredChats : false

        // console.log("1111111111111111", chat?.chats);

        let contact = contacts.find((c: any) => c.id === chat?.userId)
        if (!contact && chat?.userId === session?.user?.id) {
          const selectedChat = chat?.chats.find((chat: any) => chat.senderId !== session?.user?.id)
          contact = contacts.find((c: any) => c.id === selectedChat?.senderId)
        }

        const unseenMsgsCount = chat?.chats.filter((chat: any) => (chat.senderId !== session?.user?.id && !chat.feedback.isSeen)).length;

        // console.log("unseenMsgsCount:::::::::", unseenMsgsCount)

        return { ...contact, chat: { id: room.roomId, unseenMsgs: unseenMsgsCount, lastMessage } }
      }

      return false
    })
    const chatsContacts = filterRoom.filter(val => val !== false)

    res.status(200).json({ ok: true, result: { chatsContacts, contacts: contacts } });

  } catch (error) {
    console.log(error)
    res.status(422).json({ ok: false, message: "Chat server is not working." });
  }
}
