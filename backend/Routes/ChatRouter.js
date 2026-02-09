import express from "express";
import isAuthenticated from "../Middlewares/Auth.js";
import {
  getMyChats,
  getChatById,
} from "../Controllers/ChatController.js";

const router = express.Router();

// 🔥 All chats of logged-in user (Navbar chat list)
router.get("/", isAuthenticated, getMyChats);

// 🔥 Open specific chat by chatId
router.get("/id/:chatId", isAuthenticated, getChatById);

export default router;