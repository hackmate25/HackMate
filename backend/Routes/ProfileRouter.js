import express from "express";
import isAuthenticated from "../Middlewares/Auth.js";
import upload from "../Middlewares/upload.js";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../Controllers/ProfileController.js";

const router = express.Router();

router.get("/me", isAuthenticated, getProfile);
router.put("/update", isAuthenticated, updateProfile);

// 🔥 PROFILE IMAGE UPLOAD
router.post(
  "/upload-image",
  isAuthenticated,
  upload.single("image"),
  uploadProfileImage
);

export default router;