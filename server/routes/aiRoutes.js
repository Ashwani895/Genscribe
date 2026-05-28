import express from "express";
import { generateContent, getHistory} from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

console.log("🔥 AI ROUTES LOADED");

const router = express.Router();

router.post("/generate", protect, generateContent);
router.get("/history", protect, getHistory);


export default router;
