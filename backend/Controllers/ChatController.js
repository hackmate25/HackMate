import ChatModel from "../Modules/Chat.js";

// 🔹 Get all chats of logged-in user (for navbar / chat sidebar)
const getMyChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await ChatModel.find({
      participants: userId,
    })
      .populate("participants", "name")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      chats,
    });
  } catch (err) {
    console.error("GET MY CHATS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};

// 🔹 Get chat by chatId (MAIN CHAT OPEN API)
const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await ChatModel.findById(chatId)
      .populate("messages.sender", "name")
      .populate("participants", "name");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // 🔒 Safety: ensure user is part of chat
    if (!chat.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized for this chat",
      });
    }

    res.json({
      success: true,
      chat,
    });
  } catch (err) {
    console.error("GET CHAT BY ID ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching chat",
    });
  }
};

export { getMyChats, getChatById };