import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";

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
const server = http.createServer(app); // IMPORTANT

// ✅ REQUIRED for Render / Vercel / proxy setups
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

// ✅ Allow multiple origins
const allowedOrigins = [
  "https://hackmate-official.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Increase body size limits for image uploads
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/auth", AuthRouter);
app.use("/profile", ProfileRouter);
app.use("/match", MatchRouter);
app.use("/users", UserRouter);
app.use("/chat", ChatRouter);

// yeh woh filters ke liye hai (techstack and skills ka)
app.use("/tags", TagRouter);

// INITIALIZE SOCKET.IO
initSocket(server);

// LISTEN USING HTTP SERVER (NOT app.listen)
server.listen(PORT, () => {
  console.log(`Server + Socket running on port ${PORT}`);
  console.log("Sb chal rha hai crazyyy");
});