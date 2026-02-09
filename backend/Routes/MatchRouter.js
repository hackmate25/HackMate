import express from "express";
import isAuthenticated from "../Middlewares/Auth.js";
import {
  swipeUser,
  acceptRequest,
  rejectRequest,
  getMatches,
  getSelectedUsers,
  getPendingRequests
} from "../Controllers/MatchController.js";

const router = express.Router();

// Matching endpoints
router.post("/swipe", isAuthenticated, swipeUser);
router.post("/accept", isAuthenticated, acceptRequest);
router.post("/reject", isAuthenticated, rejectRequest);

router.get("/matches", isAuthenticated, getMatches);
router.get("/selected", isAuthenticated, getSelectedUsers);
router.get("/pending", isAuthenticated, getPendingRequests);

export default router;
