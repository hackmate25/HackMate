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

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://hackmate-ybgv.onrender.com";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    localStorage.clear();
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
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-white/70 backdrop-blur-xl z-50 border-r border-white/20 shadow-2xl flex-col">

        {/* LOGO */}
        <div
          onClick={() => navigate("/discover")}
          className="px-6 py-8 cursor-pointer"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition">
            HackMate
          </h1>
        </div>

        {/* TOP ACTIONS */}
        <div className="px-4 space-y-3 pb-6 border-b border-gray-200/50">
          <button
            onClick={() => navigate("/chat")}
            className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-semibold transition ${
              isActive("/chat")
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-white/50 hover:bg-white/80 text-gray-700"
            }`}
          >
            <MessageCircle size={22} />
            Messages
          </button>

          <button
            onClick={() => navigate("/profile")}
            className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-semibold transition ${
              isActive("/profile")
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "bg-white/50 hover:bg-white/80 text-gray-700"
            }`}
          >
            <img
              src={profileImage || "https://i.pravatar.cc/100"}
              className="w-7 h-7 rounded-full object-cover border-2 border-white"
            />
            My Profile
          </button>
        </div>

        {/* NAV LINKS */}
        <div className="flex-1 px-4 py-6 space-y-2">
          <p className="text-xs font-bold text-gray-500 px-5 mb-3">
            NAVIGATION
          </p>

          {navItems.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition ${
                isActive(path)
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "bg-white/30 hover:bg-white/60 text-gray-700"
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        {/* LOGOUT */}
        <div className="px-4 py-6 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* ================= MOBILE HEADER ================= */}
      {/* ================================================= */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-xl border-b flex items-center px-4 z-40">
        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
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
              <button onClick={() => setOpen(false)}>
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
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl ${
                  isActive("/chat")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
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
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl ${
                  isActive("/profile")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
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
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl ${
                    isActive(path)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
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
                className="w-full flex items-center gap-4 px-5 py-3 rounded-xl bg-red-500 text-white font-semibold"
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