import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "../utils/api";

const ChatListPage = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  const myUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    let mounted = true;

    const fetchChats = async () => {
      try {
        const res = await apiFetch("/chat");
        const data = await res.json();

        if (mounted && data.success) {
          setChats(data.chats);
        }
      } catch (err) {
        // 🔐 Token expiry handled centrally in apiFetch
        console.error("Chat list fetch error:", err.message);
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

      <div className="ml-72 max-w-7xl mx-auto py-10 px-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden flex h-[75vh] shadow-2xl border border-white/20">
          
          {/* LEFT SIDEBAR */}
          <div className="w-[30%] bg-gradient-to-b from-blue-100 to-indigo-100">
            <div className="p-5 font-bold text-xl text-gray-800 border-b border-white/50">
              💬 Chats
            </div>

            {chats.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                No chats yet
              </p>
            ) : (
              chats.map((chat) => {
                const otherUser = chat.participants.find(
                  (p) => p._id !== myUser?.id
                );

                return (
                  <div
                    key={chat._id}
                    onClick={() => navigate(`/chat/${chat._id}`)}
                    className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-white/60 transition-all duration-200 border-b border-white/30"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {otherUser?.name?.charAt(0)}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {otherUser?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to open chat
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT EMPTY PANEL */}
          <div className="flex-1 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
            <p className="text-gray-500 text-lg font-medium">
              👋 Select a chat to start messaging
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;