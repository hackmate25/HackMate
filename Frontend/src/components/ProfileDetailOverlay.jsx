import { X, Star } from "lucide-react";
import { motion } from "framer-motion";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

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
          className="text-blue-700 underline"
        >
          {value}
        </a>
      ) : (
        "—"
      )}
    </p>
  );
};

const ProfileDetailOverlay = ({ user, onClose, onSelect }) => {
  if (!user) return null;

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-3"
    >
      <motion.div
        variants={panelVariants}
        className="
          w-full max-w-5xl
          h-[92vh] md:h-[75vh]
          bg-[#0B1C35]
          rounded-2xl overflow-hidden
          flex flex-col md:flex-row
          relative shadow-2xl
        "
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 text-white hover:text-red-400"
        >
          <X size={26} />
        </button>

        {/* IMAGE */}
        <div className="w-full md:w-[35%] h-[35%] md:h-full bg-black">
          <img
            src={user.profileImage || "https://i.pravatar.cc/700"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* DETAILS */}
        <div className="flex-1 bg-[#A0A7B4] p-5 md:p-8 text-[#0B1C35] overflow-y-auto relative">
          <h1 className="text-2xl md:text-3xl font-semibold mb-4">
            {safeText(user.name)}
          </h1>

          <div className="space-y-2 text-sm md:text-lg">
            <p>🎂 Age: {safeText(user.age)}</p>
            <p>⚧ Gender: {safeText(user.gender)}</p>
            <p>🎓 Year: {safeText(user.year)}</p>
            <p>🧠 Skills: {safeArray(user.skills)}</p>
            <p>⚙️ Tech Stack: {safeArray(user.techStack)}</p>
            <p>🛣 Track Preference: {safeArray(user.trackPreference)}</p>
            <p>🎯 Preferred Role: {safeText(user.mostPreferredRole)}</p>
            <p>📌 Preferred Domain: {safeText(user.mostPreferredDomain)}</p>
            <p>🏁 Hackathons Participated: {safeText(user.hackathonsParticipated)}</p>
            <p>🏆 Hackathons Won: {safeText(user.hackathonsWon)}</p>
          </div>

          {/* BIO */}
          <div className="mt-4">
            <p className="text-sm md:text-base whitespace-pre-wrap break-all leading-relaxed">
              {safeText(user.bio)}
            </p>
          </div>

          {/* SOCIALS */}
          <div className="mt-4 space-y-1 text-sm md:text-lg">
            <ClickableLink label="GitHub" value={user.github} />
            <ClickableLink label="LinkedIn" value={user.linkedin} />
            <ClickableLink label="Instagram" value={user.instagram} />
          </div>

          {/* STAR */}
          <button
            onClick={onSelect}
            className="absolute bottom-4 right-4 text-yellow-400 hover:scale-125 transition"
          >
            <Star size={34} fill="currentColor" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileDetailOverlay;