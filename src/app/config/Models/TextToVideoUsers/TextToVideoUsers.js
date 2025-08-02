import mongoose from "mongoose";

const textToVideoUsersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const TextToVideoUsers =
  mongoose.models.TextToVideoUsers || mongoose.model("TextToVideoUsers", textToVideoUsersSchema);
