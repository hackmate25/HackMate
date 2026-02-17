// Simple logger utility for production-safe logging
const logger = {
  error: (message, error = "") => {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[ERROR] ${message}`, error);
    }
  },
  warn: (message) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[WARN] ${message}`);
    }
  },
  info: (message) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[INFO] ${message}`);
    }
  },
};

export default logger;
