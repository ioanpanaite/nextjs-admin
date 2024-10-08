import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from "next/types";

function ioHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!(res.socket as any).server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server((res.socket as any).server);

    io.on('connection', socket => {
      console.log(`${socket.id} connected`);

      // Join a conversation
      const { id, userId } = socket.handshake.query;
      socket.join(id as string);

      const user = { id, userId };
      io.in(id as string).emit('USER_JOIN_CHAT_EVENT', user);

      // Listen for new messages
      socket.on('NEW_CHAT_MESSAGE_EVENT', (data) => {
        const message = { id, data };
        io.in(id as string).emit('NEW_CHAT_MESSAGE_EVENT', message);
      });

      // Leave the room if the user closes the socket
      socket.on("disconnect", () => {
        io.in(id as string).emit('USER_LEAVE_CHAT_EVENT');
        socket.leave(id as string);
      });
    });

    (res.socket as any).server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler;
