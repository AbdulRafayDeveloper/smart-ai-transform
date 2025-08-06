import mongoose from "mongoose";

const textToSpeechUsersSchema = new mongoose.Schema(
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
    voiceUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const TextToSpeechUsers =
  mongoose.models.TextToSpeechUsers || mongoose.model("TextToSpeechUsers", textToSpeechUsersSchema);
