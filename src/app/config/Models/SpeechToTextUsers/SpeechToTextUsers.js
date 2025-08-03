import mongoose from "mongoose";

const speechToTextUsersSchema = new mongoose.Schema(
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
    voiceUrl: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const SpeechToTextUsers =
  mongoose.models.SpeechToTextUsers || mongoose.model("SpeechToTextUsers", speechToTextUsersSchema);
