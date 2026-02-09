import { X, Star } from "lucide-react";
import { motion } from "framer-motion";

const safeText = (v) =>
  v !== undefined && v !== null && v !== "" ? v : "—";

const safeArray = (arr) =>
  Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "—";

const formatLink = (url) => {
  if (!url || url === "—") return null;
  return url.startsWith("http") ? url : `https://${url}`;
};

const ClickableLink = ({ label, value }) => {
  const link = formatLink(value);
  return (
    <p className="break-all">
      <b>{label}:</b>{" "}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        "—"
      )}
    </p>
  );
};

const UserOverlay = ({ user, onClose, showAccept, onAccept, onReject }) => {
  if (!user) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        className="
          w-full max-w-5xl
          h-[92vh] md:h-[75vh]
          bg-white rounded-2xl shadow-xl
          flex flex-col md:flex-row
          overflow-hidden relative
        "
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:scale-110 z-10"
        >
          <X size={18} />
        </button>

        {/* IMAGE */}
        <div className="w-full md:w-1/3 h-[35%] md:h-full bg-gray-200">
          <img
            src={user.profileImage || "https://i.pravatar.cc/400"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* DETAILS */}
        <div className="flex-1 p-5 md:p-8 overflow-y-auto space-y-2 text-sm md:text-base relative">
          <h2 className="text-2xl md:text-3xl font-bold">
            {safeText(user.name)}
          </h2>

          <p><b>Age:</b> {safeText(user.age)}</p>
          <p><b>Gender:</b> {safeText(user.gender)}</p>
          <p><b>Year:</b> {safeText(user.year)}</p>

          <p className="whitespace-pre-wrap break-all leading-relaxed">
            <b>Bio:</b> {safeText(user.bio)}
          </p>

          <p><b>Skills:</b> {safeArray(user.skills)}</p>
          <p><b>Tech Stack:</b> {safeArray(user.techStack)}</p>
          <p><b>Track Preference:</b> {safeArray(user.trackPreference)}</p>
          <p><b>Preferred Role:</b> {safeText(user.mostPreferredRole)}</p>
          <p><b>Preferred Domain:</b> {safeText(user.mostPreferredDomain)}</p>
          <p><b>Hackathons Participated:</b> {safeText(user.hackathonsParticipated)}</p>
          <p><b>Hackathons Won:</b> {safeText(user.hackathonsWon)}</p>

          <ClickableLink label="GitHub" value={user.github} />
          <ClickableLink label="LinkedIn" value={user.linkedin} />
          <ClickableLink label="Instagram" value={user.instagram} />

          {showAccept && (
            <div className="absolute bottom-4 right-4 flex gap-3">
              <button
                onClick={() => onAccept?.(user._id)}
                className="text-yellow-400 hover:scale-125 transition"
              >
                <Star size={36} fill="currentColor" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserOverlay;