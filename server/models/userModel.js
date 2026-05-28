import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ======================
    // 🧠 SAAS FIELDS
    // ======================

    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    credits: {
      type: Number,
      default: 25, // your new rule
    },

    dailyLimit: {
      type: Number,
      default: 20,
    },

    usedToday: {
      type: Number,
      default: 0,
    },

    lastReset: {
      type: Date,
      default: Date.now,
    },

    lastActive: {
  type: Date,
  default: Date.now,
},

subscriptionStatus: {
  type: String,
  enum: ["active", "inactive", "canceled"],
  default: "inactive",
},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;