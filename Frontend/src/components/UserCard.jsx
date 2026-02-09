const UserCard = ({ user, onClick, showActions, onAccept, onReject, overlay, }) => {
  return (
    <div
      onClick={() => onClick?.(user)}
      className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 pb-16 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-white/20 group"
    >
      {/* IMAGE */}
      <div className="relative w-full h-36 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-blue-100 to-indigo-100">
        <img
          src={user.profileImage || "https://i.pravatar.cc/300"}
          alt={user.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* INFO */}
      <h3 className="text-center font-bold text-gray-800 text-lg leading-tight">
        {user.name}
      </h3>
      <p className="text-center text-sm text-gray-500 mt-1">
        {user.year}
      </p>

      {/* PENDING ACTIONS (Accept / Reject) */}
      {showActions && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 left-3 right-3 flex gap-2"
        >
          <button
            onClick={() => onAccept?.(user._id)}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500  hover:from-green-600 hover:to-emerald-600  text-white font-semibold text-sm shadow-md hover:scale-105 transition-all duration-200"
          >
            ✓ Accept
          </button>

          <button
            onClick={() => onReject?.(user._id)}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500  hover:from-red-600 hover:to-rose-600  text-white font-semibold text-sm shadow-md hover:scale-105 transition-all duration-200"
          >
            ✕ Reject
          </button>
        </div>
      )}

      {/* CUSTOM OVERLAY (Chat / future actions) */}
      {overlay}
    </div>
  );
};

export default UserCard;