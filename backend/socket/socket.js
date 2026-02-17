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

  // 🔐 SOCKET AUTH (JWT)
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("Token missing");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Single source of truth
      socket.userId = decoded.id;

      next();
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Socket auth error:", err.message);
      }
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    // 🔹 SECURE Join Chat Room
    socket.on("join-chat", async (chatId) => {
      try {
        if (!chatId) return;

        // ✅ Ensure user is actually part of the chat
        const chat = await ChatModel.findOne({
          _id: chatId,
          participants: socket.userId,
        }).select("_id");

        if (!chat) {
          socket.emit("unauthorized-chat");
          return;
        }

        socket.join(chatId);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Join chat error:", err.message);
        }
        socket.emit("unauthorized-chat");
      }
    });

    // 🔹 Send Message (Hardened)
    socket.on("send-message", async ({ chatId, text }) => {
      try {
        if (!chatId || !text?.trim()) return;

        // ✅ Secure fetch (ensures membership)
        const chat = await ChatModel.findOne({
          _id: chatId,
          participants: socket.userId,
        });

        if (!chat || chat.isLocked) {
          socket.emit("chat-locked");
          return;
        }

        // 🚫 Message limit enforcement
        if (chat.messages.length >= chat.messageLimit) {
          chat.isLocked = true;
          await chat.save();
          io.to(chatId).emit("chat-locked");
          return;
        }

        // ✅ Create message
        const message = {
          sender: socket.userId,
          text: text.trim(),
        };

        chat.messages.push(message);
        await chat.save();

        // 📡 Broadcast message in consistent format
        io.to(chatId).emit("new-message", {
          sender: { _id: socket.userId },
          text: message.text,
          createdAt: new Date(),
        });

      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Socket message error:", err);
        }
      }
    });

    socket.on("disconnect", () => {
      // Connection closed
    });
  });
};