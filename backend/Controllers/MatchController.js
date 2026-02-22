import UserModel from "../Modules/User.js";
import ChatModel from "../Modules/Chat.js";
import { sendEmail } from "../utils/emailService.js";
import logger from "../utils/logger.js";

const swipeUser = async (req, res) => {
  try {
    const { selectedUserId } = req.body;
    const userId = req.user.id;

    if (!selectedUserId || userId === selectedUserId) {
      return res.status(400).json({
        success: false,
        message: "Invalid selection",
      });
    }

    const [user, selectedUser] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(selectedUserId),
    ]);

    if (!user || !selectedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyMatched = user.matches.some(
      (id) => id.toString() === selectedUserId
    );

    const alreadySelected = user.selectedUsers.some(
      (id) => id.toString() === selectedUserId
    );

    if (alreadyMatched || alreadySelected) {
      return res.status(400).json({
        success: false,
        message: "User already selected or matched",
      });
    }

    user.selectedUsers.push(selectedUserId);
    selectedUser.pendingRequests.push(userId);

    await Promise.all([user.save(), selectedUser.save()]);

    await sendEmail({
      to: selectedUser.email,
      subject: "New collaboration request 🚀",
      text: `
Hey ${selectedUser.name},

${user.name} has sent you a collaboration request on HackMate.

Check your pending requests and respond before someone else teams up 😉

– Team HackMate
      `,
    });

    res.json({
      success: true,
      message: "User selected successfully",
    });
  } catch (err) {
    logger.error("swipeUser error:", err);
    res.status(500).json({
      success: false,
      message: "Error in swiping user",
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user.id;

    const [user, requester] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(requesterId),
    ]);

    if (!user || !requester) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hasPending = user.pendingRequests.some(
      (id) => id.toString() === requesterId
    );

    if (!hasPending) {
      return res.status(400).json({
        success: false,
        message: "No pending request",
      });
    }

    user.pendingRequests = user.pendingRequests.filter(
      (id) => id.toString() !== requesterId
    );

    requester.selectedUsers = requester.selectedUsers.filter(
      (id) => id.toString() !== userId
    );

    const alreadyMatchedUser = user.matches.some(
      (id) => id.toString() === requesterId
    );

    if (!alreadyMatchedUser) {
      user.matches.push(requesterId);
    }

    const alreadyMatchedRequester = requester.matches.some(
      (id) => id.toString() === userId
    );

    if (!alreadyMatchedRequester) {
      requester.matches.push(userId);
    }

    const existingChat = await ChatModel.findOne({
      participants: { $all: [userId, requesterId] },
    });

    if (!existingChat) {
      await ChatModel.create({
        participants: [userId, requesterId],
      });
    }

    await Promise.all([user.save(), requester.save()]);

    await sendEmail({
      to: requester.email,
      subject: "It's a Match! 🎉",
      text: `
Congrats ${requester.name}!

You and ${user.name} are now matched on HackMate 🎯
Start chatting and build something awesome together.

– Team HackMate
      `,
    });

    await sendEmail({
      to: user.email,
      subject: "Match confirmed 🚀",
      text: `
Hey ${user.name},

You’ve successfully matched with ${requester.name}.
The chat is now open — break the ice and get to work!

– Team HackMate
      `,
    });

    res.json({
      success: true,
      message: "Request accepted, matched & chat created",
    });
  } catch (err) {
    logger.error("acceptRequest error:", err);
    res.status(500).json({
      success: false,
      message: "Error accepting request",
    });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user.id;

    const [user, requester] = await Promise.all([
      UserModel.findById(userId),
      UserModel.findById(requesterId),
    ]);

    if (!user || !requester) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.pendingRequests = user.pendingRequests.filter(
      (id) => id.toString() !== requesterId
    );

    requester.selectedUsers = requester.selectedUsers.filter(
      (id) => id.toString() !== userId
    );

    await Promise.all([user.save(), requester.save()]);

    res.json({
      success: true,
      message: "Request rejected",
    });
  } catch (err) {
    logger.error("rejectRequest error:", err);
    res.status(500).json({
      success: false,
      message: "Error rejecting request",
    });
  }
};

const getMatches = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate(
      "matches",
      `
      name
      bio
      age
      gender
      year
      profileImage
      skills
      techStack
      trackPreference
      projects
      mostPreferredRole
      mostPreferredDomain
      hackathonsParticipated
      hackathonsWon
      github
      linkedin
      instagram
    `
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      matches: user.matches || [],
    });
  } catch (err) {
    logger.error("getMatches error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch matches",
    });
  }
};

const getSelectedUsers = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate(
      "selectedUsers",
      `
      name
      bio
      age
      gender
      year
      profileImage
      skills
      techStack
      trackPreference
      projects
      mostPreferredRole
      mostPreferredDomain
      hackathonsParticipated
      hackathonsWon
      github
      linkedin
      instagram
    `
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      selectedUsers: user.selectedUsers || [],
    });
  } catch (err) {
    logger.error("getSelectedUsers error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch selected users",
    });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate(
      "pendingRequests",
      `
      name
      bio
      age
      gender
      year
      profileImage
      skills
      techStack
      trackPreference
      projects
      mostPreferredRole
      mostPreferredDomain
      hackathonsParticipated
      hackathonsWon
      github
      linkedin
      instagram
    `
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      pendingRequests: user.pendingRequests || [],
    });
  } catch (err) {
    logger.error("getPendingRequests error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending requests",
    });
  }
};

export {
  swipeUser,
  acceptRequest,
  rejectRequest,
  getMatches,
  getSelectedUsers,
  getPendingRequests,
};