import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { apiFetch } from "../utils/api";

const ChatLayoutPage = () => {
  const { otherUserId } = useParams();

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ======================================
        AUTO OPEN CHAT FROM URL PARAM
  ====================================== */
  useEffect(() => {
    const fetchChatFromUser = async () => {
      if (!otherUserId) return;

      try {
        setLoading(true);

        // 🔥 Backend expects /chat/:otherUserId
        const res = await apiFetch(`/chat/${otherUserId}`);
        const data = await res.json();

        if (data.success && data.chat?._id) {
          setSelectedChatId(data.chat._id);
        } else {
          console.warn("Chat not found");
        }
      } catch (err) {
        console.error("Chat fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChatFromUser();
  }, [otherUserId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Navbar />

      <div className="lg:ml-72 pt-14 lg:pt-0 max-w-7xl mx-auto py-4 sm:py-10 px-2 sm:px-4 lg:px-6">
        <div
          className="bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl 
          overflow-hidden flex flex-col lg:flex-row h-[75vh] 
          shadow-2xl border border-white/20"
        >
          {/* SIDEBAR */}
          <ChatSidebar
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
          />

          {/* LOADING STATE */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <ChatWindow
              selectedChatId={selectedChatId}
              setSelectedChatId={setSelectedChatId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayoutPage;