import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { jwtDecode } from "jwt-decode";
import { apiFetch } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";

const formatTime = (date) => {
  if (!date) return "";
  const msgDate = new Date(date);
  return msgDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatWindow = ({ selectedChatId, setSelectedChatId }) => {
  const token = localStorage.getItem("token");

  let myUserId = null;
  try {
    const decoded = jwtDecode(token);
    myUserId = decoded.id;
  } catch {
    return null;
  }

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  /* ===========================
        FETCH CHAT
  =========================== */
  useEffect(() => {
    if (!selectedChatId) return;

    const fetchChat = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/chat/id/${selectedChatId}`);
        const data = await res.json();
        if (data.success) {
          setChat(data.chat);
          setMessages(data.chat.messages || []);
          setLocked(data.chat.isLocked);
        }
      } catch (err) {
        console.error("Chat fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [selectedChatId]);

  /* ===========================
        SOCKET LIFECYCLE
  =========================== */
  useEffect(() => {
    if (!selectedChatId || !token) return;

    socket.auth = { token };
    socket.connect();

    socket.emit("join-chat", selectedChatId);

    // 🔵 Mark messages as read when chat opens
    socket.emit("mark-read", selectedChatId);

    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("messages-delivered", ({ userId }) => {
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          deliveredTo: [...new Set([...(msg.deliveredTo || []), userId])],
        }))
      );
    });

    socket.on("messages-read", ({ userId }) => {
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          readBy: [...new Set([...(msg.readBy || []), userId])],
        }))
      );
    });

    socket.on("chat-locked", () => setLocked(true));

    return () => {
      socket.off("new-message");
      socket.off("messages-delivered");
      socket.off("messages-read");
      socket.off("chat-locked");
      socket.disconnect();
    };
  }, [selectedChatId]);

  /* ===========================
        AUTO SCROLL
  =========================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedChatId) {
    return (
      <div className="hidden lg:flex flex-1 bg-gradient-to-b from-blue-50 to-white items-center justify-center">
        <p className="text-gray-500 text-lg">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const otherUser = chat?.participants?.find(
    (p) => p._id !== myUserId
  );

  const sendMessage = () => {
    if (!text.trim() || locked) return;
    socket.emit("send-message", { chatId: selectedChatId, text });
    setText("");
  };

  const renderTicks = (msg) => {
    if (!msg) return null;

    if (msg.readBy?.length > 1)
      return <span className="text-blue-200 text-xs ml-1">✓✓</span>;

    if (msg.deliveredTo?.length > 1)
      return <span className="text-gray-300 text-xs ml-1">✓✓</span>;

    return <span className="text-gray-300 text-xs ml-1">✓</span>;
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-50 to-white">

      {/* HEADER */}
      <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center px-4 font-semibold">
        <button
          onClick={() => setSelectedChatId(null)}
          className="lg:hidden mr-3"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
            {otherUser?.name?.charAt(0)}
          </div>
          <span>{otherUser?.name}</span>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => {
          const isMe =
            (msg.sender?._id || msg.sender) === myUserId;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center text-xs mr-2">
                  {otherUser?.name?.charAt(0)}
                </div>
              )}

              <div className="flex flex-col max-w-xs sm:max-w-sm lg:max-w-[70%]">
                <div
                  className={`px-4 py-2 rounded-xl text-sm shadow-md ${
                    isMe
                      ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>

                <div
                  className={`flex items-center mt-1 text-[10px] ${
                    isMe ? "justify-end text-gray-300" : "justify-start text-gray-400"
                  }`}
                >
                  <span>{formatTime(msg.createdAt)}</span>
                  {isMe && renderTicks(msg)}
                </div>
              </div>
            </motion.div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* LOCK WARNING */}
      {locked && (
        <div className="mx-4 mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
          ⚠️ Chat locked. Message limit reached.
        </div>
      )}

      {/* INPUT */}
      <div className="p-4 bg-white flex gap-3 border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          disabled={locked}
          placeholder={
            locked
              ? "Chat locked (limit reached)"
              : "Type a message..."
          }
          className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
        />

        <button
          onClick={sendMessage}
          disabled={locked || !text.trim()}
          className="bg-green-500 text-white px-6 py-2 rounded-xl disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;