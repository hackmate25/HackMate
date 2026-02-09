import express from "express";
import isAuthenticated from "../Middlewares/Auth.js";
import { discoverUsers } from "../Controllers/UserController.js";

const router = express.Router();

router.get("/discover", isAuthenticated, discoverUsers);

export default router;