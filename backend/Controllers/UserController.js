import UserModel from "../Modules/User.js";

const PAGE_SIZE = 20;

const discoverUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔹 Get current user (exclude interacted users)
    const currentUser = await UserModel.findById(userId)
      .select("selectedUsers pendingRequests matches")
      .lean();

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const excludeIds = [
      userId,
      ...currentUser.selectedUsers,
      ...currentUser.pendingRequests,
      ...currentUser.matches,
    ];

    // 🔹 Read query params
    const { year, skills, techStack, trackPreference, gender } = req.query;
    const page = Number(req.query.page) || 0;

    // 🔹 Base filter
    const filter = {
      _id: { $nin: excludeIds },
    };

    // 🔹 Dynamic filters
    if (year) filter.year = year;
    if (gender) filter.gender = gender;
    if (skills) filter.skills = { $in: skills.split(",") };
    if (techStack) filter.techStack = { $in: techStack.split(",") };
    if (trackPreference) {
      filter.trackPreference = { $in: trackPreference.split(",") };
    }

    // 🔹 Fetch paginated users
    let users = await UserModel.find(filter)
      .skip(page * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .select(
        "name bio age gender year profileImage skills techStack trackPreference projects mostPreferredRole mostPreferredDomain hackathonsParticipated hackathonsWon github linkedin instagram"
      );

    // 🔁 If page exhausted → reset to page 0
    if (users.length === 0 && page !== 0) {
      users = await UserModel.find(filter)
        .limit(PAGE_SIZE)
        .select(
          "name bio age gender year profileImage skills techStack trackPreference projects mostPreferredRole mostPreferredDomain hackathonsParticipated hackathonsWon github linkedin instagram"
        );

      return res.json({
        success: true,
        users,
        reset: true,
        page: 0,
      });
    }

    // ✅ Normal response
    return res.json({
      success: true,
      users,
      reset: false,
      page,
    });
  } catch (error) {
    console.error("DISCOVER USERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to discover users",
    });
  }
};

export { discoverUsers };