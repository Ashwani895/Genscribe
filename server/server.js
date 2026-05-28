import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();
const app = express();
app.use((req, res, next) => {
  console.log("REQUEST HIT:", req.method, req.url);
  next();
});
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payment", paymentRoutes);
console.log("UPDATED SERVER RUNNING");

app.get("/hello", (req, res) => {
  res.send("HELLO WORKING");
});



console.log("🔥 AI ROUTES MOUNTED");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
