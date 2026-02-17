import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { socket } from "../socket";
import { jwtDecode } from "jwt-decode";
import { apiFetch } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";

// ⏱️ time formatter with smart display
const formatTime = (date) => {
  if (!date) return "";
  const msgDate = new Date(date);
  const today = new Date();
  const isToday = msgDate.toDateString() === today.toDateString();
  
  if (isToday) {
    return msgDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  return msgDate.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🔐 SAFE JWT DECODE
  let myUserId = null;
  try {
    if (!token) throw new Error("Token missing");
    const decoded = jwtDecode(token);
    myUserId = decoded.id;
  } catch {
    navigate("/login");
    return null;
  }

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [locked, setLocked] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  /* ---------------- FETCH CHAT ---------------- */
  useEffect(() => {
    let mounted = true;

    const fetchChat = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/chat/id/${chatId}`);
        const data = await res.json();

        if (mounted && data.success) {
          setChat(data.chat);
          setMessages(data.chat.messages || []);
          setLocked(data.chat.isLocked);
        }
      } catch (err) {
        if (import.meta.env.MODE === 'development') {
          console.error("Chat fetch error:", err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchChat();

    return () => {
      mounted = false;
    };
  }, [chatId]);

  /* ---------------- SOCKET LIFECYCLE ---------------- */
  useEffect(() => {
    if (!token) return;

    socket.auth = { token };
    socket.connect();
    socket.emit("join-chat", chatId);

    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setIsTyping(false);
    });

    socket.on("user-typing", () => {
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    });

    socket.on("chat-locked", () => {
      setLocked(true);
    });

    return () => {
      socket.off("new-message");
      socket.off("user-typing");
      socket.off("chat-locked");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.disconnect();
    };
  }, [chatId, token]);

  /* ---------------- AUTO SCROLL WITH SMOOTH BEHAVIOR ---------------- */
  useEffect(() => {
    const scrollWithDelay = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(scrollWithDelay);
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || locked) return;
    socket.emit("send-message", { chatId, text });
    setText("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <Navbar />
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading chat...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <p className="text-gray-500 text-lg">Chat not found</p>
          <button
            onClick={() => navigate("/chat")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-all"
          >
            Back to Chats
          </button>
        </div>
      </div>
    );
  }

  const otherUser = chat.participants.find(
    (p) => p._id !== myUserId
  );

  const messageProgress = Math.round((messages.length / chat.messageLimit) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Navbar />

      <div className="lg:ml-72 pt-14 lg:pt-0 max-w-7xl mx-auto py-4 sm:py-10 px-2 sm:px-4 lg:px-6 h-screen flex flex-col">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl overflow-hidden flex flex-col h-[75vh] shadow-2xl border border-white/20">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-12 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between px-3 sm:px-6 font-semibold shadow-lg"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => navigate("/chat")}
                className="lg:hidden p-1 sm:p-2 rounded-lg hover:bg-blue-500/50 transition-all cursor-pointer flex-shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0">
                {otherUser?.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-base truncate">{otherUser?.name}</p>
                <p className="text-xs font-light opacity-75 hidden sm:block">Online</p>
              </div>
            </div>
            <div className="text-xs sm:text-sm opacity-75 flex-shrink-0">
              {messages.length}/{chat.messageLimit}
            </div>
          </motion.div>

          {/* PROGRESS BAR */}
          <div className="h-1 bg-gray-200 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${messageProgress}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full transition-all ${
                messageProgress > 70
                  ? "bg-red-400"
                  : messageProgress > 40
                  ? "bg-yellow-400"
                  : "bg-green-400"
              }`}
            />
          </div>

          {/* MESSAGES CONTAINER */}
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 space-y-2 sm:space-y-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="text-center text-gray-400">
                    <p className="text-2xl sm:text-4xl mb-2">💬</p>
                    <p className="font-medium text-sm sm:text-base">No messages yet</p>
                    <p className="text-xs sm:text-sm">Say hello to {otherUser?.name}!</p>
                  </div>
                </motion.div>
              ) : (
                messages.map((msg, i) => {
                  const senderId =
                    typeof msg.sender === "string"
                      ? msg.sender
                      : msg.sender?._id;

                  const isMe = senderId === myUserId;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-end gap-1 sm:gap-2 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMe && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0 shadow-sm"
                        >
                          {otherUser?.name?.charAt(0)}
                        </motion.div>
                      )}

                      <div className="flex flex-col max-w-xs sm:max-w-sm lg:max-w-[70%]">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`px-3 sm:px-4 lg:px-5 py-2 sm:py-3 rounded-lg sm:rounded-2xl text-xs sm:text-sm shadow-md backdrop-blur-sm transition-all ${
                            isMe
                              ? "bg-gradient-to-r from-green-400/90 to-emerald-400/90 text-white rounded-br-sm border border-green-300/50"
                              : "bg-white/90 text-gray-800 rounded-bl-sm border border-gray-200/50"
                          }`}
                        >
                          <p className="break-words">{msg.text}</p>
                        </motion.div>

                        <span
                          className={`text-[8px] sm:text-[10px] mt-1 font-medium ${
                            isMe
                              ? "text-right text-gray-400"
                              : "text-left text-gray-400"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>

                      {isMe && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>

            {/* TYPING INDICATOR */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-end gap-1 sm:gap-2"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs sm:text-sm font-semibold">
                    {otherUser?.name?.charAt(0)}
                  </div>
                  <div className="bg-gray-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6 }}
                        className="w-2 h-2 rounded-full bg-gray-500"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="w-2 h-2 rounded-full bg-gray-500"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-gray-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* WARNING MESSAGE */}
          <AnimatePresence>
            {locked && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-2 sm:mx-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm font-medium text-center">
                  ⚠️ Chat locked. Message limit reached.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* INPUT AREA */}
          <motion.div
            className="p-4 bg-white/80 backdrop-blur-sm flex gap-2 sm:gap-4 border-t border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={locked}
              placeholder={
                locked
                  ? "Chat locked (limit reached)"
                  : "Type a message..."
              }
              className="flex-1 border-2 border-gray-200 rounded-lg sm:rounded-xl px-2 sm:px-4 lg:px-5 py-2 sm:py-3 text-xs sm:text-base outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:bg-gray-100 min-h-10"
            />

            <motion.button
              onClick={sendMessage}
              disabled={locked || !text.trim()}
              whileHover={!locked && text.trim() ? { scale: 1.05 } : {}}
              whileTap={!locked && text.trim() ? { scale: 0.95 } : {}}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white px-3 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl font-semibold disabled:opacity-50 cursor-pointer transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 sm:gap-2 flex-shrink-0 min-h-10"
            >
              <Send size={16} className="sm:size-18 flex-shrink-0" />
              <span className="hidden sm:inline text-xs sm:text-sm">Send</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;