import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "../utils/api";
import { motion } from "framer-motion";

const ChatListPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const navigate = useNavigate();

  const myUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    let mounted = true;

    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await apiFetch("/chat");
        const data = await res.json();

        if (mounted && data.success) {
          setChats(data.chats);
        }
      } catch (err) {
        // 🔐 Token expiry handled centrally in apiFetch
        if (import.meta.env.MODE === 'development') {
          console.error("Chat list fetch error:", err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchChats();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Navbar />

      <div className="lg:ml-72 pt-14 lg:pt-0 max-w-7xl mx-auto py-4 sm:py-10 px-2 sm:px-4 lg:px-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[75vh] shadow-2xl border border-white/20">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full lg:w-[30%] bg-gradient-to-b from-blue-100 to-indigo-100 lg:border-r border-b lg:border-b-0 border-white/50 overflow-y-auto max-h-96 lg:max-h-none">
            <div className="p-3 sm:p-5 font-bold text-lg sm:text-xl text-gray-800 border-b border-white/50 flex items-center gap-2 sticky top-0 bg-blue-100/80 backdrop-blur-sm">
              <span className="text-xl sm:text-2xl">💬</span> <span className="hidden sm:inline">Chats</span>
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
                <p className="text-sm text-gray-400 mt-2">Start matching to begin conversations!</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {chats.map((chat, idx) => {
                  const otherUser = chat.participants.find(
                    (p) => p._id !== myUser?.id
                  );

                  return (
                    <motion.div
                      key={chat._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        setSelectedChatId(chat._id);
                        navigate(`/chat/${chat._id}`);
                      }}
                      className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-3 sm:py-4 cursor-pointer transition-all duration-200 border-b border-white/30 min-h-[56px] ${
                        selectedChatId === chat._id
                          ? "bg-white/80 shadow-md border-l-4 border-l-blue-500"
                          : "hover:bg-white/60"
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0 text-sm sm:text-base"
                      >
                        {otherUser?.name?.charAt(0)}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                          {otherUser?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate hidden sm:block">
                          Tap to open chat
                        </p>
                      </div>
                      
                      {selectedChatId === chat._id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-blue-500 text-lg flex-shrink-0"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* RIGHT EMPTY PANEL - Hidden on Mobile */}
          <div className="hidden lg:flex flex-1 bg-gradient-to-b from-blue-50 to-white flex-col items-center justify-center py-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center px-4"
            >
              <p className="text-4xl sm:text-5xl mb-3 sm:mb-4">👋</p>
              <p className="text-gray-500 text-base sm:text-lg font-medium">Select a chat to start messaging</p>
              <p className="text-gray-400 text-sm mt-2">Your conversations will appear here</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;