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

const PORT = process.env.PORT || 3000;

// ✅ Allow multiple origins
const allowedOrigins = [
  "https://hack-mate-ten.vercel.app",
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

app.use(bodyParser.json());

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