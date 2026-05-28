import OpenAI from "openai";
import dotenv from "dotenv";

import Content from "../models/contentModel.js";
import User from "../models/userModel.js";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// 💰 COST SYSTEM
const MODE_COST = {
  chat: 1,
  write: 2,
  code: 3,
  summary: 2,
};

// =========================
// 🤖 GENERATE AI CONTENT
// =========================
export const generateContent = async (req, res) => {
  try {
    const {
      prompt,
      mode = "chat",
      tone = "normal",
      language = "English",
    } = req.body;

    // =========================
    // VALIDATION
    // =========================
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    // =========================
    // FIND USER
    // =========================
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =========================
    // UPDATE LAST ACTIVE
    // =========================
    user.lastActive = new Date();

    // =========================
    // DAILY RESET
    // =========================
    const today = new Date().toDateString();

    const lastReset = user.lastReset
      ? new Date(user.lastReset).toDateString()
      : today;

    if (today !== lastReset) {
      user.usedToday = 0;
      user.lastReset = new Date();
    }

    // =========================
    // 💰 COST CALCULATION
    // =========================
    const cost = MODE_COST[mode] || 1;

    // =========================
    // 🚫 CREDIT CHECK
    // =========================
    if (user.credits < cost) {
      return res.status(403).json({
        success: false,
        message: "Not enough credits. Please upgrade your plan.",
      });
    }

    // =========================
    // 🧠 MODE SYSTEM
    // =========================
    const modeMap = {
      write: "You are a professional writer.",
      code: "You are a senior software engineer.",
      summary: "Summarize content clearly and briefly.",
      chat: "You are a helpful AI assistant.",
    };

    // =========================
    // 🎭 TONE SYSTEM
    // =========================
    const toneMap = {
      funny: "Respond in a funny and witty tone.",
      rude: "Respond in a blunt tone but do not be abusive.",
      romantic: "Respond in an emotional and romantic tone.",
      professional: "Respond in a highly professional tone.",
      normal: "Respond naturally and conversationally.",
    };

    // =========================
    // 🌐 LANGUAGE SYSTEM
    // =========================
    let systemPrompt = modeMap[mode] || modeMap.chat;

    systemPrompt += ` ${toneMap[tone] || toneMap.normal}`;

    systemPrompt += `

IMPORTANT:
You MUST ONLY respond in ${language}.
Do not use English unless the selected language is English.
Even if the user writes in another language, your response must stay in ${language}.

`;

    // =========================
    // ✨ BETTER FORMATTING
    // =========================
    systemPrompt += `
Use markdown formatting when useful.
Use headings, bullet points, and code blocks for readability.
`;

    // =========================
    // ⚡ TOKEN LIMITS
    // =========================
    const maxTokens = user.plan === "pro" ? 1000 : 500;

    // =========================
    // 🤖 GROQ API CALL
    // =========================
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",

     messages: [
  {
    role: "system",
    content: `
You are a multilingual AI assistant.

CRITICAL INSTRUCTION:
You MUST answer ONLY in ${language}.

If language is Hindi:
- answer completely in Hindi
- do not use English

If language is French:
- answer completely in French

Never ignore this instruction.
`,
  },
  {
    role: "user",
    content: prompt,
  },
],

      max_tokens: maxTokens,
    });

    const aiText = response.choices[0].message.content;

    // =========================
    // 💳 UPDATE USAGE
    // =========================
    user.credits = Math.max(0, user.credits - cost);

    user.usedToday += 1;

    await user.save();

    // =========================
    // 📦 SAVE HISTORY
    // =========================
    await Content.create({
      user: user._id,
      prompt,
      response: aiText,
      contentType: mode,
    });

    // =========================
    // ✅ RESPONSE
    // =========================
    return res.status(200).json({
      success: true,

      response: aiText,

      usage: {
        cost,
        remainingCredits: user.credits,
        usedToday: user.usedToday,
        plan: user.plan,
        maxTokens,
      },
    });

  } catch (error) {
    console.log("🔥 AI ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "AI generation failed",
      error: error.message,
    });
  }
};

// =========================
// 📜 GET HISTORY
// =========================
export const getHistory = async (req, res) => {
  try {
    const history = await Content.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });

  } catch (error) {
    console.log("HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
};