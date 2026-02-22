import express from "express";
import { signupInit, verifyOtp, login, verifyToken } from "../Controllers/AuthController.js";
import { loginValidation, signupValidation } from "../Middlewares/AuthValidation.js";
import { signupOtpLimiter, loginLimiter, verifyOtpLimiter } from "../Middlewares/rateLimiter.js";

const router = express.Router();

// Step 1: Signup Init (OTP send), RATE LIMITED
router.post(
  "/signup-init",
  signupOtpLimiter,
  signupValidation,
  signupInit
);

// Step 2: Verify OTP, RATE LIMITED
router.post(
  "/verify-otp",
  verifyOtpLimiter,
  verifyOtp
);

// Login Route, RATE LIMITED
router.post(
  "/login",
  loginLimiter,
  loginValidation,
  login
);

// Verify Token Route (for session persistence)
router.get(
  "/verify",
  verifyToken
);

export default router;