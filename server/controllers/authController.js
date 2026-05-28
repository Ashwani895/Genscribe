import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ======================
// 🧠 SIGNUP (SaaS READY)
// ======================
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // VALIDATION
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER (SaaS DEFAULTS ADDED)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      // 🧠 SaaS fields
      plan: "free",
      credits: 25,
      dailyLimit: 20,
      usedToday: 0,
      lastReset: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        credits: user.credits,
        dailyLimit: user.dailyLimit,
        usedToday: user.usedToday,
      },
    });

  } catch (error) {
    console.log("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

// ======================
// 🔐 LOGIN (SaaS READY)
// ======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // GENERATE JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,

        // 🧠 SaaS data for frontend
        plan: user.plan,
        credits: user.credits,
        dailyLimit: user.dailyLimit,
        usedToday: user.usedToday,
      },
    });

  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};