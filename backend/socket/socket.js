import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import ChatModel from "../Modules/Chat.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://hack-mate-ten.vercel.app",
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
      socket.userId = decoded.id; // ✅ SINGLE SOURCE OF TRUTH
      next();
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Socket auth error");
      }
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    // Socket connected

    // 🔹 Join specific chat room
    socket.on("join-chat", (chatId) => {
      if (!chatId) return;
      socket.join(chatId);
    });

    // 🔹 Send message
    socket.on("send-message", async ({ chatId, text }) => {
      try {
        if (!chatId || !text?.trim()) return;

        const chat = await ChatModel.findById(chatId);
        if (!chat || chat.isLocked) {
          socket.emit("chat-locked");
          return;
        }

        // 🔒 Ensure sender is part of chat
        const isParticipant = chat.participants
          .map((id) => id.toString())
          .includes(socket.userId);

        if (!isParticipant) return;

        // 🚫 Message limit check
        if (chat.messages.length >= chat.messageLimit) {
          chat.isLocked = true;
          await chat.save();
          io.to(chatId).emit("chat-locked");
          return;
        }

        // ✅ Save message in DB (sender as ObjectId)
        const message = {
          sender: socket.userId,
          text: text.trim(),
        };

        chat.messages.push(message);
        await chat.save();

        // 📡 Broadcast message (CONSISTENT FORMAT)
        io.to(chatId).emit("new-message", {
          sender: { _id: socket.userId }, // 🔥 ALWAYS OBJECT
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
      // Socket disconnected
    });
  });
};