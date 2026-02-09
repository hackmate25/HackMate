import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import UserOverlay from "../components/UserOverlay";
import { apiFetch } from "../utils/api";

const MyMatches = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [active, setActive] = useState(null);

  const fetchMatches = async () => {
    try {
      const res = await apiFetch("/match/matches");
      const data = await res.json();
      setUsers(data.matches || []);
    } catch (err) {
      console.error("Fetch matches error:", err.message);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await apiFetch("/chat");
      const data = await res.json();
      setChats(data.chats || []);
    } catch (err) {
      console.error("Fetch chats error:", err.message);
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchChats();
  }, []);

  const openChatWithUser = (userId) => {
    const chat = chats.find((c) =>
      c.participants.some((p) => p._id === userId)
    );

    if (!chat) {
      alert("Chat not found. Try again.");
      return;
    }

    navigate(`/chat/${chat._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Navbar />

      <div className="lg:ml-72 pt-14 lg:pt-0 max-w-7xl mx-auto py-10 px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/discover")}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/70 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 border border-white/20"
          >
            ←
          </button>

          <div className="bg-white/70 backdrop-blur-sm px-5 md:px-8 py-2 md:py-3 rounded-full shadow-lg font-semibold text-gray-800 border border-white/20 text-sm md:text-base">
            My Matches ({users.length})
          </div>
        </div>

        {users.length === 0 ? (
          <p className="text-center text-gray-500 mt-24 md:mt-32">
            No matches yet 🤝
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
            {users.map((u) => (
              <div key={u._id} className="relative">
                <UserCard
                  user={u}
                  onClick={setActive}
                  overlay={
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openChatWithUser(u._id);
                      }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600  hover:from-blue-700 hover:to-indigo-700  text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-200"
                    >
                      💬 Chat
                    </button>
                  }
                />
              </div>

            ))}
          </div>
        )}
      </div>

      {active && (
        <UserOverlay
          user={active}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
};

export default MyMatches;