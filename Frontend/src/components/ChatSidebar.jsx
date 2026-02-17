import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

const ChatSidebar = ({ selectedChatId, setSelectedChatId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 SAME LOGIC AS CHATWINDOW
  const token = localStorage.getItem("token");

  let myUserId = null;
  try {
    const decoded = jwtDecode(token);
    myUserId = decoded.id?.toString();
  } catch {
    myUserId = null;
  }

  useEffect(() => {
    let mounted = true;

    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await apiFetch("/chat");
        const data = await res.json();

        if (mounted && data.success) {
          setChats(data.chats || []);
        }
      } catch (err) {
        console.error("Sidebar fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchChats();
    return () => { mounted = false };
  }, []);

  /* 🔥 EXACT SAME STYLE COMPARISON AS CHATWINDOW */
  const getParticipantId = (p) => {
    if (!p) return null;
    return (p._id || p)?.toString?.();
  };

  const renderTick = (msg) => {
    if (!msg) return null;

    if (msg.readBy?.length > 1)
      return <span className="text-blue-400 text-xs ml-1">✓✓</span>;

    if (msg.deliveredTo?.length > 1)
      return <span className="text-gray-400 text-xs ml-1">✓✓</span>;

    return <span className="text-gray-400 text-xs ml-1">✓</span>;
  };

  return (
    <div
      className={`w-full lg:w-[30%] bg-gradient-to-b from-blue-100 to-indigo-100 
      lg:border-r border-b lg:border-b-0 border-white/50 
      overflow-y-auto max-h-96 lg:max-h-none ${
        selectedChatId ? "hidden lg:block" : "block"
      }`}
    >
      <div className="p-3 sm:p-5 font-bold text-lg sm:text-xl text-gray-800 
      border-b border-white/50 flex items-center gap-2 sticky top-0 
      bg-blue-100/80 backdrop-blur-sm">
        <span className="text-xl sm:text-2xl">💬</span>
        <span className="hidden sm:inline">Chats</span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      ) : chats.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-500 mt-10 px-4"
        >
          <p className="text-3xl mb-3">📭</p>
          <p className="font-medium">No chats yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Start matching to begin conversations!
          </p>
        </motion.div>
      ) : (
        chats.map((chat, idx) => {

          // 🔥 SAME LOGIC AS CHATWINDOW
          const otherUser = chat.participants.find(
            (p) => getParticipantId(p) !== myUserId
          );

          const lastMessage =
            chat.messages?.[chat.messages.length - 1];

          return (
            <motion.div
              key={chat._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedChatId(chat._id)}
              className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-3 sm:py-4 cursor-pointer transition-all duration-200 border-b border-white/30 min-h-[56px] ${
                selectedChatId === chat._id
                  ? "bg-white/80 shadow-md border-l-4 border-l-blue-500"
                  : "hover:bg-white/60"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                bg-gradient-to-br from-blue-400 to-indigo-500 
                flex items-center justify-center text-white 
                font-bold shadow-md flex-shrink-0 text-sm sm:text-base"
              >
                {otherUser?.name?.charAt(0)}
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                  {otherUser?.name}
                </p>

                <div className="flex items-center text-xs text-gray-500 truncate">
                  {lastMessage &&
                    (lastMessage.sender?._id || lastMessage.sender)?.toString() === myUserId &&
                    renderTick(lastMessage)}

                  <span className="ml-1 truncate">
                    {lastMessage?.text || "No messages yet"}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default ChatSidebar;