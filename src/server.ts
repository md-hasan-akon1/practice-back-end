import { Server } from "http";
import { Server as SocketIOServer } from "socket.io"; // Import Socket.IO
import config from "./config";

import prisma from "./shared/prisma";
import app from "./app";
import oneToOne from "./shared/chat/oneToOne";
import { initializeWebSocketServer } from "./shared/websocket/massage";


let server: Server;
let io: SocketIOServer;

async function startServer() {
  server = app.listen(config.port, () => {
    console.log("Server is listening on port ", config.port);
  });

 
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Replace with your frontend's origin for better security
      methods: ["GET", "POST"],
    },
  });

initializeWebSocketServer(server)
  // Handle Socket.IO connections
  // io.on("connection", async(socket) => {
  //   console.log("A user connected: ", socket.id);

  //   // Pass the socket and io instance to the oneToOne function
  //   await oneToOne(socket, io);

  //   socket.on("disconnect", () => {
  //     console.log("A user disconnected: ", socket.id);
  //   });
  // });
}

async function main() {
  await startServer();

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
        restartServer();
      });
    } else {
      process.exit(1);
    }
  };

  const restartServer = () => {
    console.info("Restarting server...");
    main();
  };

  process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception: ", error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection: ", error);
    exitHandler();
  });

  // Handling the server shutdown with SIGTERM and SIGINT
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Shutting down gracefully...");
    exitHandler();
  });

  process.on("SIGINT", () => {
    console.log("SIGINT signal received. Shutting down gracefully...");
    exitHandler();
  });
}

main();
