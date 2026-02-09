import rateLimit from "express-rate-limit";

/**
 * 🔐 OTP + Signup rate limiter
 * Prevents OTP spam & email abuse
 */
export const signupOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,                  // max 5 OTP requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Try again after 10 minutes.",
  },
});

/**
 * 🔑 Login rate limiter
 * Prevents brute-force login
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                 // max 10 login attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

/**
 * ✅ OTP verification limiter
 * Prevents OTP guessing
 */
export const verifyOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP verification attempts. Slow down.",
  },
});