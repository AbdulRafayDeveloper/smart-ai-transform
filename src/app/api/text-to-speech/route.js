import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import gTTS from "gtts"; // ✅ Correct default import
import {
  successResponse,
  badRequestResponse,
  serverErrorResponse,
} from "../../helper/apiResponseHelpers";

// Text validation helper
function validateText(data) {
  if (!data?.text || typeof data.text !== "string" || data.text.trim() === "") {
    return { error: "Text field is required and must be a non-empty string." };
  }
  return { error: null };
}


export async function POST(req) {
  try {
    const { text } = await req.json();

    const { error } = validateText({ text });
    if (error) {
      return badRequestResponse(error, null);
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "text-to-speech");

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${uuidv4()}.mp3`;
    const filepath = path.join(uploadDir, filename);
    const relativePath = `/uploads/text-to-speech/${filename}`;

    const gtts = new gTTS(text, "en");

    await new Promise((resolve, reject) => {
      gtts.save(filepath, function (err) {
        if (err) return reject(err);
        resolve();
      });
    });

    return successResponse("Voice generated successfully", {
      voicePath: relativePath,
    });
  } catch (error) {
    return serverErrorResponse("Error generating voice: " + error.message);
  }
}
