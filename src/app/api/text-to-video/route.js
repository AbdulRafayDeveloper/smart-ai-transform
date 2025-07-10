// // src/app/api/text-to-video/route.js

// import fs from "fs";
// import path from "path";
// import { InferenceClient } from "@huggingface/inference";
// import { NextResponse } from "next/server";

// export const runtime = "nodejs";

// // Initialize client (routes through HF and third-party providers) :contentReference[oaicite:5]{index=5}
// const client = new InferenceClient(process.env.HF_API_TOKEN);

// export async function POST(req) {
//   try {
//     const { prompt } = await req.json();
//     if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
//       return NextResponse.json(
//         { success: false, message: "Prompt is required." },
//         { status: 400 }
//       );
//     }

//     // Invoke text-to-video on Fal AI with a free, supported model :contentReference[oaicite:6]{index=6}
//     const blob = await client.textToVideo({
//       provider: "fal-ai",
//       model: "Wan-AI/Wan2.1-T2V-1.3B",
//       inputs: prompt,
//       parameters: { num_frames: 85, guidance_scale: 7.5 }
//     });

//     // Convert Blob → ArrayBuffer → Node Buffer
//     const arrayBuffer = await blob.arrayBuffer();
//     const videoBuffer = Buffer.from(arrayBuffer);

//     // Save under public/uploads/videos
//     const uploadDir = path.join(process.cwd(), "public", "uploads", "text-to-video");
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//     const filename = `video-${Date.now()}.mp4`;
//     const filePath = path.join(uploadDir, filename);
//     fs.writeFileSync(filePath, videoBuffer, { encoding: "binary" });

//     return NextResponse.json(
//       { success: true, videoUrl: `/uploads/text-to-video/${filename}` },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Text-to-Video error:", err);
//     return NextResponse.json(
//       { success: false, message: "Error generating video: " + err.message },
//       { status: 500 }
//     );
//   }
// }


// src/app/api/text-to-video/route.js

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { InferenceClient } from "@huggingface/inference";
import { successResponse, badRequestResponse, serverErrorResponse } from "../../helper/apiResponseHelpers";
import dotenv from "dotenv";

dotenv.config();

// Initialize HF JS SDK client
const client = new InferenceClient(process.env.HF_API_TOKEN);

// Validate prompt helper
function validatePrompt(prompt) {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return { error: "Prompt is required and must be a non-empty string." };
  }
  return { error: null };
}

export async function POST(req) {
  try {
    // read JSON body
    const { prompt } = await req.json();

    // validate
    const { error } = validatePrompt(prompt);
    if (error) {
      return badRequestResponse(error, null);
    }

    // call text-to-video (via Fal AI provider)
    const blob = await client.textToVideo({
      provider: "fal-ai",
      model: "Wan-AI/Wan2.1-T2V-1.3B",
      inputs: prompt,
      parameters: { num_frames: 85, guidance_scale: 7.5 }
    });

    // convert returned Blob → ArrayBuffer → Buffer
    const arrayBuffer = await blob.arrayBuffer();
    const videoBuffer = Buffer.from(arrayBuffer);

    // ensure upload dir exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "text-to-video");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // write file with uuid name
    const filename = `${uuidv4()}.mp4`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, videoBuffer, { encoding: "binary" });

    // respond with relative URL
    return successResponse("Video generated successfully", {
      videoPath: `/uploads/text-to-video/${filename}`
    });

  } catch (err) {
    console.error("Text-to-Video error:", err);
    return serverErrorResponse("Error generating video: " + (err.message || err));
  }
}
