import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    
    prompt: {
      type: String,
      required: true,
    },

    response: {
      type: String,
      required: true,
    },

    contentType: {
      type: String,
      default: "general",
    },
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model("Content", contentSchema);

export default Content;