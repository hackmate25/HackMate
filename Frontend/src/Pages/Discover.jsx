import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

import Navbar from "../components/Navbar";
import ProfileDetailOverlay from "../components/ProfileDetailOverlay";



const swipeVariants = {
  center: {
    x: 0,
    y: 0,
    opacity: 1,
    rotate: 0,
    scale: 1,
    zIndex: 10,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1] // Custom easing for smooth motion
    }
  },
  left: {
    x: -400,
    y: -30,
    opacity: 0,
    rotate: -15,
    scale: 0.9,
    zIndex: 0,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1]
    }
  },
  right: {
    x: 400,
    y: -30,
    opacity: 0,
    rotate: 15,
    scale: 0.9,
    zIndex: 0,
    transition: {
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1]
    }
  },
};

// 🔥 SAFE SHUFFLE (NO MUTATION)
const shuffleArray = (arr) => {
  return [...arr].sort(() => Math.random() - 0.5);
};

const Discover = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [page, setPage] = useState(0);

  const [counts, setCounts] = useState({
    selected: 0,
    matches: 0,
    pending: 0,
  });

  // 🔹 Fetch discover users + counts
  useEffect(() => {
    apiFetch(`/users/discover?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        setUsers(shuffleArray(data.users));
        setIndex(0);

        // 🔁 backend reset signal
        if (data.reset) {
          setPage(0);
        }
      })
      .catch((err) => console.error("Discover fetch error:", err.message));

    refreshCounts();
  }, [page]);

  useEffect(() => {
    if (index >= users.length && users.length > 0) {
      setPage((p) => p + 1);
    }
  }, [index]);

  const refreshCounts = async () => {
    try {
      const [s, m, p] = await Promise.all([
        apiFetch("/match/selected").then((r) => r.json()),
        apiFetch("/match/matches").then((r) => r.json()),
        apiFetch("/match/pending").then((r) => r.json()),
      ]);

      setCounts({
        selected: s.selectedUsers?.length || 0,
        matches: m.matches?.length || 0,
        pending: p.pendingRequests?.length || 0,
      });
    } catch (err) {
      console.error("Count refresh error:", err.message);
    }
  };

  // LEFT SWIPE (REJECT)
  const swipeLeft = () => {
    setDirection("left");
    setOverlay("reject");

    setTimeout(() => {
      setIndex((i) => i + 1);
      setDirection(null);
      setOverlay(null);
    }, 500);
  };

  // RIGHT SWIPE (SELECT)
  const swipeRight = () => {
    const user = users[index];
    if (!user) return;

    setDirection("right");
    setOverlay("accept");

    // Fire API call in background without blocking animation
    apiFetch("/match/swipe", {
      method: "POST",
      body: JSON.stringify({ selectedUserId: user._id }),
    }).then(() => refreshCounts());


    // Proceed with animation immediately
    setTimeout(() => {
      setIndex((i) => i + 1);
      setDirection(null);
      setOverlay(null);
    }, 500);
  };

  const user = users[index];
  const nextUser = users[index + 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 overflow-hidden">
      <Navbar />
      <div className="lg:ml-72 pt-14 lg:pt-0">

        {/* CARD AREA */}
        <div className="relative flex justify-center items-center py-20">
          {/* NEXT CARD PREVIEWS (LEFT + RIGHT) */}
          {nextUser && (
            <>
              <motion.div
                key={`${nextUser._id}-left`}
                initial={{ opacity: 0, x: -40, scale: 0.94 }}
                animate={{
                  opacity: 0.65,
                  x: direction === "left" ? -28 : 0,
                  scale: direction === "left" ? 0.99 : 0.965,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="hidden lg:block absolute left-[120px] -translate-x-10 w-[420px] h-[620px] bg-white/60 backdrop-blur-3xl rounded-3xl shadow-xl border border-white/20 overflow-hidden z-0 pointer-events-none"
              >
                <div className="relative h-[60%] overflow-hidden">
                  <img
                    src={nextUser.profileImage || "https://i.pravatar.cc/600"}
                    className="w-full h-full object-cover blur-[6px]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                </div>
                <div className="p-5 h-[40%]">
                  <p className="text-white/80 text-sm font-semibold">{nextUser.name}</p>
                  <p className="text-white/60 text-xs">{nextUser.year}</p>
                </div>
              </motion.div>

              <motion.div
                key={`${nextUser._id}-right`}
                initial={{ opacity: 0, x: 40, scale: 0.94 }}
                animate={{
                  opacity: 0.7,
                  x: direction === "right" ? 28 : 0,
                  scale: direction === "right" ? 0.99 : 0.965,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="hidden lg:block absolute right-[120px] translate-x-10 w-[420px] h-[620px] bg-white/60 backdrop-blur-3xl rounded-3xl shadow-xl border border-white/20 overflow-hidden z-0 pointer-events-none"
              >
                <div className="relative h-[60%] overflow-hidden">
                  <img
                    src={nextUser.profileImage || "https://i.pravatar.cc/600"}
                    className="w-full h-full object-cover blur-[6px]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                </div>
                <div className="p-5 h-[40%]">
                  <p className="text-white/80 text-sm font-semibold">{nextUser.name}</p>
                  <p className="text-white/60 text-xs">{nextUser.year}</p>
                </div>
              </motion.div>
            </>
          )}
          {/* CARD */}
          <AnimatePresence>
            {user && (
              <motion.div
                key={user._id}
                variants={swipeVariants}
                initial="center"
                animate={direction || "center"}
                exit={direction}
                onClick={() => setActiveUser(user)}
                className="w-[92vw] max-w-[420px] h-[82vh] max-h-[720px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden cursor-pointer relative border border-white/20 z-10"
              >
                {/* Image Section */}
                <div className="relative h-[60%] overflow-hidden">
                  <img
                    src={user.profileImage || "https://i.pravatar.cc/600"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Name on Image */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">{user.name}</h3>
                    <p className="text-white/90 text-sm md:text-lg font-medium mt-1">{user.year}</p>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="p-4 md:p-6 h-[45%] flex flex-col pb-20">
                  <div className="flex-1 overflow-y-auto">
                    <p className="text-md font-bold text-gray-500 mb-2 uppercase tracking-wide">About</p>
                    {user.bio ? (
                      <p className="text-gray-700 text-md leading-relaxed">{user.bio}</p>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No bio available</p>
                    )}

                    {/* Additional Info */}
                    {(user.skills?.length > 0 || user.techStack?.length > 0) && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {(user.skills || user.techStack)?.slice(0, 5).map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        swipeLeft();
                      }}
                      className=" flex-5 flex items-center justify-center gap-4 px-1 py-3 md:py-4 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-full shadow-lg text-white font-bold text-lg transition-all duration-200 cursor-pointer"
                    >
                      <X size={24} strokeWidth={2.5} />

                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        swipeRight();
                      }}
                      className="flex-5 flex items-center justify-center gap-4 px-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-full shadow-lg text-white font-bold text-lg transition-all duration-200 cursor-pointer"
                    >
                      <Check size={24} strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>

                {overlay === "reject" && (
                  <div className="absolute inset-0 bg-red-500/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-8 shadow-2xl">
                      <X size={80} className="text-red-600 md:size-[120px]" strokeWidth={3} />
                    </div>
                  </div>
                )}

                {overlay === "accept" && (
                  <div className="absolute inset-0 bg-green-500/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-8 shadow-2xl">
                      <Check size={80} className="text-green-600 md:size-[120px]" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* PROFILE OVERLAY */}
        {activeUser && (
          <ProfileDetailOverlay
            user={activeUser}
            onClose={() => setActiveUser(null)}
            onSelect={async () => {
              setActiveUser(null);
              await swipeRight();
            }}
          />
        )}
      </div>
    </div>
  );
};


const BottomPill = ({ label, count, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ y: -4, scale: 1.05 }}
    className="relative px-10 py-3 bg-white rounded-full shadow cursor-pointer"
  >
    {label}
    <span className="absolute -top-2 -right-2 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
      {count}
    </span>
  </motion.div>
);

export default Discover;