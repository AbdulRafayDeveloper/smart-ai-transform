import mongoose from "mongoose";

const imageToTextUsersSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

export const ImageToTextUsers = mongoose.models.ImageToTextUsers || mongoose.model("ImageToTextUsers", imageToTextUsersSchema);
