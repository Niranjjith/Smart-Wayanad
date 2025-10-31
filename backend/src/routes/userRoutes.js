import express from "express";
import { registerUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

// POST /api/users → Register
router.post("/", registerUser);

// GET /api/users → List all users
router.get("/", getUsers);

export default router;
