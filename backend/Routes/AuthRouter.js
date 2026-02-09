import express from "express";
import { signupInit, verifyOtp, login } from "../Controllers/AuthController.js";
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

export default router;