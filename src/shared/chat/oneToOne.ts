import { Server, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// A map to track connected users and their socket instances
const userSockets = new Map();
console.log({userSockets})
const oneToOne = (socket: Socket, io: Server) => {
  // Store the user's socket connection on login
  //   socket.on("user_connected", (userId: string) => {
  //     userSockets.set(userId, socket);
  //     console.log(`User connected: ${userId}`);
  //   });

  // Handle sending messages
  socket.on("message", async (payload) => {
    try {
      const data = JSON.parse(payload);

      const { senderId, receiverId, message } = data.data;
      const roomId=`${receiverId}-${senderId}`

      const connect=socket.join(roomId);
   socket.data.roomId=roomId
      // Store the message in the database using Prisma
      const chat = await prisma.chat.create({
        data: {
          message,
          senderId,
          receiverId,
        },
      });

      // Retrieve the receiver's socket
      const receiverSocket = userSockets.get(receiverId);

      if (receiverSocket) {
        // Send the message to the receiver if online
        receiverSocket.emit("message", chat);
      }

      // Send the message back to the sender
      socket.to(socket.data.roomId).emit("message", chat);
      
    } catch (error) {
      console.error("Error in sending message: ", error);
    }
  });

  // Remove the user's socket connection on disconnect
  socket.on("disconnect", () => {
    for (const [userId, userSocket] of userSockets.entries()) {
      if (userSocket === socket) {
        userSockets.delete(userId);
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  });
};

export default oneToOne;
