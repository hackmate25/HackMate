import {
  Menu,
  X,
  MessageCircle,
  LogOut,
  Users,
  Heart,
  Clock,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const API_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
).replace(/\/$/, "");

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const token = localStorage.getItem("token");

  const [profileImage, setProfileImage] = useState(null);
  const [open, setOpen] = useState(false);

  /* ---------------- FETCH PROFILE IMAGE ---------------- */
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/profile/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfileImage(data.profile.profileImage);
        }
      })
      .catch(() => {});
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Discover", path: "/discover", icon: Users },
    { label: "My Selections", path: "/selections", icon: Heart },
    { label: "My Matches", path: "/matches", icon: Users },
    { label: "Pending Requests", path: "/pending", icon: Clock },
  ];

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  /* ===================================================== */
  /* ================= DESKTOP SIDEBAR =================== */
  /* ===================================================== */

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 xl:w-72 bg-white/70 backdrop-blur-xl z-50 border-r border-white/20 shadow-2xl flex-col">

        {/* LOGO */}
        <div
          onClick={() => navigate("/discover")}
          className="px-4 sm:px-6 py-6 sm:py-8 cursor-pointer"
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition">
            HackMate
          </h1>
        </div>

        {/* TOP ACTIONS */}
        <div className="px-3 sm:px-4 space-y-2 sm:space-y-3 pb-4 sm:pb-6 border-b border-gray-200/50">
          <button
            onClick={() => navigate("/chat")}
            className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer min-h-10 ${
              isActive("/chat")
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                : "bg-white/50 hover:bg-white/80 text-gray-700 hover:translate-x-1"
            }`}
          >
            <MessageCircle size={20} className="flex-shrink-0" />
            <span className="hidden sm:inline">Messages</span>
          </button>

          <button
            onClick={() => navigate("/profile")}
            className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer min-h-10 ${
              isActive("/profile")
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                : "bg-white/50 hover:bg-white/80 text-gray-700 hover:translate-x-1"
            }`}
          >
            <img
              src={profileImage || "https://i.pravatar.cc/100"}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-white flex-shrink-0"
            />
            <span className="hidden sm:inline">My Profile</span>
          </button>
        </div>

        {/* NAV LINKS */}
        <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2">
          <p className="text-xs font-bold text-gray-500 px-3 sm:px-5 mb-2 sm:mb-3">
            NAVIGATION
          </p>

          {navItems.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm sm:text-base min-h-10 ${
                isActive(path)
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/30 hover:bg-white/60 text-gray-700 hover:translate-x-1"
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* LOGOUT */}
        <div className="px-3 sm:px-4 py-4 sm:py-6 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold text-sm sm:text-base shadow-lg hover:scale-105 active:scale-[0.98] transition-all duration-200 cursor-pointer min-h-10"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* ================= MOBILE HEADER ================= */}
      {/* ================================================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-xl border-b flex items-center px-3 sm:px-4 z-40 justify-between">
        <button onClick={() => setOpen(true)} className="cursor-pointer hover:opacity-70 transition-all duration-200 min-h-10 min-w-10 flex items-center justify-center">
          <Menu size={24} />
        </button>

        <h1
          onClick={() => navigate("/discover")}
          className="ml-4 font-bold text-lg text-blue-600"
        >
          HackMate
        </h1>
      </div>

      {/* ================================================= */}
      {/* ================= MOBILE DRAWER ================= */}
      {/* ================================================= */}
      {open && (
        <>
          {/* BACKDROP */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* DRAWER */}
          <div className="fixed top-0 left-0 h-screen w-72 bg-white z-50 shadow-2xl flex flex-col animate-slideIn">

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <h2 className="font-bold text-xl text-blue-600">
                HackMate
              </h2>
              <button onClick={() => setOpen(false)} className="cursor-pointer hover:opacity-70 transition">
                <X size={26} />
              </button>
            </div>

            {/* TOP */}
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => {
                  navigate("/chat");
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition cursor-pointer ${
                  isActive("/chat")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <MessageCircle size={20} />
                Messages
              </button>

              <button
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition cursor-pointer ${
                  isActive("/profile")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <img
                  src={profileImage || "https://i.pravatar.cc/100"}
                  className="w-7 h-7 rounded-full object-cover"
                />
                My Profile
              </button>
            </div>

            {/* NAV */}
            <div className="flex-1 px-4 space-y-2">
              {navItems.map(({ label, path, icon: Icon }) => (
                <button
                  key={path}
                  onClick={() => {
                    navigate(path);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition cursor-pointer ${
                    isActive(path)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>

            {/* LOGOUT */}
            <div className="px-4 py-6 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition cursor-pointer"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;