import express from "express";
import { 
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  getUsers,
  upload,
} from "../controllers/userController.js";
import { registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/users → Register
router.post("/", registerUser);

// GET /api/users → List all users
router.get("/", getUsers);

// GET /api/users/profile → Get user profile (protected)
router.get("/profile", protect, getUserProfile);

// PUT /api/users/profile → Update user profile (protected)
router.put("/profile", protect, upload.single("profilePhoto"), updateUserProfile);

// PUT /api/users/settings → Update user settings (protected)
router.put("/settings", protect, updateUserSettings);

export default router;
