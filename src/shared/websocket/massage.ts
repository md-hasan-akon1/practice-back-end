import { Server } from "http";
import { json } from "stream/consumers";
import WebSocket  from "ws"



// Initialize a WebSocket server
export  const initializeWebSocketServer = (server:Server) => {
  const wss = new WebSocket.Server({ server });

  console.log("WebSocket server initialized");

  // Handle new connections
  wss.on("connection", (ws, req) => {
    console.log("New client connected");

    // Send a welcome message to the client
    ws.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));

    // Handle messages from the client
    ws.on("message", (message) => {
        const decodedMessage = message.toString();
        const parsedMessage = JSON.parse(decodedMessage);
      
  

      // Example: Echo the message back to the client
      ws.send(JSON.stringify(parsedMessage.data));
    });

    // Handle connection closure
    ws.on("close", () => {
      console.log("Client disconnected");
    });

    // Handle errors
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  return wss;
};


