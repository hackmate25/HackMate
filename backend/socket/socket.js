import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import ChatModel from "../Modules/Chat.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://hackmate-official.vercel.app",
      ],
      credentials: true,
    },
  });

  /*SOCKET AUTH MIDDLEWARE*/
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("Token missing");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;

      next();
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Socket auth error:", err.message);
      }
      next(new Error("Unauthorized"));
    }
  });

  /*CONNECTION HANDLER*/
  io.on("connection", (socket) => {

    /* JOIN CHAT (Secure + Delivered)*/
    socket.on("join-chat", async (chatId) => {
      try {
        if (!chatId) return;

        const chat = await ChatModel.findOne({
          _id: chatId,
          participants: socket.userId,
        });

        if (!chat) {
          socket.emit("unauthorized-chat");
          return;
        }

        socket.join(chatId);

        // Mark all messages as delivered for this user
        await ChatModel.updateOne(
          { _id: chatId },
          {
            $addToSet: {
              "messages.$[].deliveredTo": socket.userId,
            },
          }
        );

        io.to(chatId).emit("messages-delivered", {
          userId: socket.userId,
        });

      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Join chat error:", err.message);
        }
        socket.emit("unauthorized-chat");
      }
    });


    /* SEND MESSAGE */
    socket.on("send-message", async ({ chatId, text }) => {
      try {
        if (!chatId || !text?.trim()) return;

        const chat = await ChatModel.findOne({
          _id: chatId,
          participants: socket.userId,
        });

        if (!chat || chat.isLocked) {
          socket.emit("chat-locked");
          return;
        }

        // Enforce message limit
        if (chat.messages.length >= chat.messageLimit) {
          chat.isLocked = true;
          await chat.save();
          io.to(chatId).emit("chat-locked");
          return;
        }

        const message = {
          sender: socket.userId,
          text: text.trim(),
          deliveredTo: [socket.userId],
          readBy: [socket.userId],
        };

        chat.messages.push(message);
        await chat.save();

        // Emit full structured message
        io.to(chatId).emit("new-message", {
          sender: { _id: socket.userId },
          text: message.text,
          createdAt: message.createdAt,
          deliveredTo: message.deliveredTo,
          readBy: message.readBy,
        });

      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Socket message error:", err);
        }
      }
    });


    /*MARK AS READ*/
    socket.on("mark-read", async (chatId) => {
      try {
        if (!chatId) return;

        const chat = await ChatModel.findOne({
          _id: chatId,
          participants: socket.userId,
        });

        if (!chat) return;

        await ChatModel.updateOne(
          { _id: chatId },
          {
            $addToSet: {
              "messages.$[].readBy": socket.userId,
            },
          }
        );

        io.to(chatId).emit("messages-read", {
          userId: socket.userId,
        });

      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Mark read error:", err);
        }
      }
    });


    /*DISCONNECT*/
    socket.on("disconnect", () => {
      // Optional: add online/offline tracking later
    });

  });
};