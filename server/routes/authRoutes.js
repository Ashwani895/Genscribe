import express from "express";
import { signup, login } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// 🔥 ADD THIS (IMPORTANT)
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json({
    success: true,
    user,
  });
});

export default router;