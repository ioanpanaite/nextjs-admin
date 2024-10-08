import { Dispatch } from "react";
import { io } from "socket.io-client";
import { sendMsg } from "src/store/apps/chat";

interface Feedback {
  isSent: boolean
  isDelivered: boolean
  isSeen: boolean
}

interface Chat {
  message: string
  time: string
  senderId: string
  feedback: Feedback
}

interface Room {
  roomId: string
  userId: string
}

export default function useChat(socketRef: any, room: Room, dispatch: Dispatch<any>) {
  if (!room) {
    return;
  }

  fetch('/api/chat/socketio').finally(() => {
    socketRef.current = io({
      query: { id: room.roomId, userId: room.userId }
    });

    socketRef.current.on("connect", () => {
      console.log(socketRef.current.id);
    });

    socketRef.current.on('USER_JOIN_CHAT_EVENT', (room: Room) => {
      if (room.roomId === socketRef.current.id) return;
    });

    socketRef.current.on('NEW_CHAT_MESSAGE_EVENT', async (message: any) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      console.log("incomingMessage::::::::", incomingMessage)
      dispatch(sendMsg(incomingMessage))
    });

    return () => {
      socketRef.current.disconnect();
    };
  });

}

export const sendMessage = (socketRef: any, messageBody: string) => {
  if (!socketRef.current) return;
  socketRef.current.emit('NEW_CHAT_MESSAGE_EVENT', {
    body: messageBody,
    senderId: socketRef.current.id,
  });
};

export const checkMessage = (socketRef: any, selectedChat: any) => {
  if (!socketRef.current) return;
  
  // console.log('CHECK_CHAT_MESSAGE_EVENT socketRef', selectedChat);
  socketRef.current.emit('CHECK_CHAT_MESSAGE_EVENT', selectedChat);
};

export const leaveChat = (socketRef: any, roomId: string) => {
  if (!socketRef.current) return;
  
  // console.log('USER_LEAVE_CHAT_EVENT socketRef', socketRef)
  socketRef.current.emit('USER_LEAVE_CHAT_EVENT', { roomId });
};

export const startTypingMessage = (socketRef: any) => {
  if (!socketRef.current) return;
  socketRef.current.emit('START_TYPING_MESSAGE_EVENT', {
    senderId: socketRef.current.id,

    // room,
  });
};

export const stopTypingMessage = (socketRef: any) => {
  if (!socketRef.current) return;
  socketRef.current.emit('STOP_TYPING_MESSAGE_EVENT', {
    senderId: socketRef.current.id,

    // room,
  });
};
