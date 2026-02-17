import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import "./Modules/db.js";

import AuthRouter from "./Routes/AuthRouter.js";
import ProfileRouter from "./Routes/ProfileRouter.js";
import MatchRouter from "./Routes/MatchRouter.js";
import UserRouter from "./Routes/UserRouter.js";
import ChatRouter from "./Routes/ChatRouter.js";
import TagRouter from "./Routes/TagRouter.js";

import { initSocket } from "./socket/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());

// Trust proxy for production deployments
app.set("trust proxy", 1);
app.disable("x-powered-by");

// Logging
const morganFormat = NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));

// CORS configuration
const allowedOrigins = [
  "https://hackmate-official.vercel.app",
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: NODE_ENV === "production" ? 86400 : 3600,
  })
);

// Body parser with size limits
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/auth", AuthRouter);
app.use("/profile", ProfileRouter);
app.use("/match", MatchRouter);
app.use("/users", UserRouter);
app.use("/chat", ChatRouter);
app.use("/tags", TagRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = NODE_ENV === "production" ? "Internal Server Error" : err.message;
  res.status(statusCode).json({ error: message });
});

// Initialize Socket.IO
initSocket(server);

// Start server
server.listen(PORT, () => {
  if (NODE_ENV !== "production") {
    console.log(`Server + Socket running on port ${PORT}`);
  }
});