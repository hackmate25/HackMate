import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { socket } from "../socket";
import { jwtDecode } from "jwt-decode";
import { apiFetch } from "../utils/api";

// ⏱️ time formatter
const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
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

  const messagesEndRef = useRef(null);

  /* ---------------- FETCH CHAT ---------------- */
  useEffect(() => {
    let mounted = true;

    const fetchChat = async () => {
      try {
        const res = await apiFetch(`/chat/id/${chatId}`);
        const data = await res.json();

        if (mounted && data.success) {
          setChat(data.chat);
          setMessages(data.chat.messages || []);
          setLocked(data.chat.isLocked);
        }
      } catch (err) {
        console.error("Chat fetch error:", err.message);
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
    });

    socket.on("chat-locked", () => {
      setLocked(true);
    });

    return () => {
      socket.off("new-message");
      socket.off("chat-locked");
      socket.disconnect();
    };
  }, [chatId, token]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || locked) return;
    socket.emit("send-message", { chatId, text });
    setText("");
  };

  if (!chat) {
    return (
      <div className="min-h-screen bg-[#D7EEFF] flex items-center justify-center">
        Loading chat...
      </div>
    );
  }

  const otherUser = chat.participants.find(
    (p) => p._id !== myUserId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Navbar />

      <div className="ml-72 max-w-7xl mx-auto py-10 px-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden flex h-[75vh] shadow-2xl border border-white/20">

          {/* LEFT SIDEBAR PLACEHOLDER */}
          <div className="w-[30%] bg-gradient-to-b from-blue-100 to-indigo-100" />

          {/* CHAT AREA */}
          <div className="flex-1 bg-gradient-to-b from-blue-50 to-white flex flex-col">

            {/* HEADER */}
            <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center px-6 font-semibold shadow-lg">
              {otherUser?.name}
            </div>

            <p className="text-xs text-center text-gray-500 mt-3 mb-2 font-medium">
              {messages.length}/{chat.messageLimit} messages used
            </p>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.map((msg, i) => {
                const senderId =
                  typeof msg.sender === "string"
                    ? msg.sender
                    : msg.sender?._id;

                const isMe = senderId === myUserId;

                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                        {otherUser?.name?.charAt(0)}
                      </div>
                    )}

                    <div className="flex flex-col max-w-[70%]">
                      <div
                        className={`px-5 py-3 rounded-2xl text-sm shadow-sm ${
                          isMe
                            ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-br-sm"
                            : "bg-white text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>

                      <span
                        className={`text-[10px] mt-1 ${
                          isMe
                            ? "text-right text-gray-300"
                            : "text-left text-gray-400"
                        }`}
                      >
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>

                    {isMe && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white flex items-center justify-center text-xs font-semibold">
                        ME
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-4 bg-white/80 backdrop-blur-sm flex gap-4 border-t border-gray-200">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={locked}
                placeholder={
                  locked
                    ? "Chat locked (limit reached)"
                    : "Type your message..."
                }
                className="flex-1 border-2 border-gray-200 rounded-xl px-5 py-3 outline-none focus:border-blue-400"
              />

              <button
                onClick={sendMessage}
                disabled={locked}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 rounded-xl font-semibold disabled:opacity-50"
              >
                Send
              </button>
            </div>

            {locked && (
              <p className="text-red-500 text-sm text-center pb-3 font-medium">
                ⚠️ Chat locked. Message limit reached.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;