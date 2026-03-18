import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import UserOverlay from "../components/UserOverlay";
import { apiFetch } from "../utils/api";

const MyMatches = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/match/matches");
      const data = await res.json();

      if (data.success) {
        setUsers(data.matches || []);
      }
    } catch (err) {
      if (import.meta.env.MODE === "development") {
        console.error("Fetch matches error:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // ✅ Correct Navigation
  const openChatWithUser = (userId) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Navbar />

      <div className="lg:ml-72 pt-16 sm:pt-20 lg:pt-9 max-w-7xl mx-auto py-6 sm:py-10 px-2 sm:px-4 lg:px-6">
        
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/discover")}
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/70 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 border border-white/20 cursor-pointer text-sm sm:text-base flex-shrink-0"
          >
            ←
          </button>

          <div className="bg-white/70 backdrop-blur-sm px-3 sm:px-5 md:px-8 py-2 md:py-3 rounded-full shadow-md font-semibold text-gray-800 border border-white/20 text-xs sm:text-sm md:text-base">
            My Matches ({users.length})
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500 mt-16 sm:mt-24 md:mt-32 text-sm sm:text-base">
            No matches yet
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
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 
                      bg-gradient-to-r from-blue-500 to-indigo-600  
                      hover:from-blue-700 hover:to-indigo-700  
                      text-white px-5 py-2 rounded-full text-sm font-semibold 
                      shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
                    >
                      Chat
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