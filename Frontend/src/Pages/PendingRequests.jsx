import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import UserOverlay from "../components/UserOverlay";
import { apiFetch } from "../utils/api";

const PendingRequests = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(null);

  const fetchData = async () => {
    try {
      const res = await apiFetch("/match/pending");
      const data = await res.json();
      setUsers(data.pendingRequests || []);
    } catch (err) {
      console.error("Fetch pending requests error:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            Pending Requests ({users.length})
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
          {users.map((u) => (
            <UserCard
              key={u._id}
              user={u}
              onClick={setActive}
              showActions
              onAccept={async (id) => {
                await apiFetch("/match/accept", {
                  method: "POST",
                  body: JSON.stringify({ requesterId: id }),
                });
                fetchData();
              }}
              onReject={async (id) => {
                await apiFetch("/match/reject", {
                  method: "POST",
                  body: JSON.stringify({ requesterId: id }),
                });
                fetchData();
              }}
            />
          ))}
        </div>
      </div>

      {active && (
        <UserOverlay
          user={active}
          showAccept
          onAccept={() => {}}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
};

export default PendingRequests;