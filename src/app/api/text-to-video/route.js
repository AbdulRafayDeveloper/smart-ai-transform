// import fs from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { InferenceClient } from "@huggingface/inference";
// import { successResponse, badRequestResponse, serverErrorResponse } from "../../helper/apiResponseHelpers";
// import dotenv from "dotenv";
// dotenv.config();

// import { Users } from "@/app/config/Models/Users/users";
// import { TextToVideoUsers } from "@/app/config/Models/TextToVideoUsers/TextToVideoUsers";
// import { NextResponse } from "next/server";
// import serverSideValidation from "@/app/helper/serverSideValidation";
// import OpenAI from "openai";
// import fs from "fs";
// import path from "path";

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// // Initialize HF JS SDK client
// const client = new InferenceClient(process.env.HF_API_TOKEN);

// // Validate prompt helper
// function validatePrompt(prompt) {
//   if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
//     return { error: "Prompt is required and must be a non-empty string." };
//   }
//   return { error: null };
// }

// export async function POST(req) {
//   try {

//     const token = serverSideValidation.extractAuthToken(req);

//     if (typeof token !== "string") {
//       return notFoundResponse("Token not found or invalid.", null);
//     }

//     console.log("Token:", token);

//     const user = await serverSideValidation.validateUserByToken(token);

//     console.log("User:", user);

//     // Check if it's a NextResponse object (error), then return it directly
//     if (user && user.status) {
//       return user;
//     }

//     if (!user || !user._id) {
//       return notFoundResponse("User not found or invalid token.", null);
//     }


//     console.log("User:", user);

//     const id = user._id;

//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: "User ID not found." },
//         { status: 404 }
//       );
//     }

//     // Find user by id
//     const userData = await Users.findById(id);

//     console.log("User Data:", userData);

//     if (!userData) {
//       return notFoundResponse("User not found.", null);
//     }

//     const formData = await req.formData();
//     const prompt = formData.get("text");

//     if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
//       return badRequestResponse("Prompt is required and must be a non-empty string.", null);
//     }

//     console.log("Prompt received:", prompt);

//     const { error } = validatePrompt(prompt);
//     if (error) {
//       return badRequestResponse(error, null);
//     }

//     console.log("Valid prompt:", prompt);

//     // call text-to-video (via Fal AI provider)
//     const blob = await client.textToVideo({
//       provider: "fal-ai",
//       model: "Wan-AI/Wan2.1-T2V-1.3B",
//       inputs: prompt,
//       parameters: { num_frames: 85, guidance_scale: 7.5 }
//     });

//     console.log("Video blob received:", blob);

//     // convert returned Blob → ArrayBuffer → Buffer
//     const arrayBuffer = await blob.arrayBuffer();
//     const videoBuffer = Buffer.from(arrayBuffer);

//     console.log("Video buffer created, size:", videoBuffer.length);

//     // ensure upload dir exists
//     const uploadDir = path.join(process.cwd(), "public", "uploads", "text-to-video");
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     console.log("Upload directory ensured:", uploadDir);

//     // write file with uuid name
//     const filename = `${uuidv4()}.mp4`;
//     const filepath = path.join(uploadDir, filename);
//     fs.writeFileSync(filepath, videoBuffer, { encoding: "binary" });

//     console.log("Video file written:", filepath);

//     // respond with relative URL
//     return successResponse("Video generated successfully", {
//       videoPath: `/uploads/text-to-video/${filename}`
//     });

//   } catch (err) {
//     console.error("Text-to-Video error:", err);
//     return serverErrorResponse("Error generating video: " + (err.message || err));
//   }
// }

// with open ai

// import fs from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { execSync } from "child_process";
// import {
//   successResponse,
//   badRequestResponse,
//   serverErrorResponse,
//   notFoundResponse,
// } from "../../helper/apiResponseHelpers";

// import { Users } from "@/app/config/Models/Users/users";
// import { TextToVideoUsers } from "@/app/config/Models/TextToVideoUsers/TextToVideoUsers";
// import serverSideValidation from "@/app/helper/serverSideValidation";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Text prompt validation
// function validatePrompt(prompt) {
//   if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
//     return { error: "Prompt is required and must be a non-empty string." };
//   }
//   return { error: null };
// }

// export async function POST(req) {
//   try {
//     const token = serverSideValidation.extractAuthToken(req);

//     if (typeof token !== "string") {
//       return notFoundResponse("Token not found or invalid.", null);
//     }

//     const user = await serverSideValidation.validateUserByToken(token);
//     if (user && user.status) return user;
//     if (!user || !user._id) {
//       return notFoundResponse("User not found or invalid token.", null);
//     }

//     const userData = await Users.findById(user._id);
//     if (!userData) {
//       return notFoundResponse("User not found.", null);
//     }

//     const { text } = await req.json();
//     const { error } = validatePrompt(text);
//     if (error) {
//       return badRequestResponse(error, null);
//     }

//     // Directory for temporary frames
//     const framesDir = path.join(process.cwd(), "public", "uploads", "text-to-video-temp");
//     if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

//     const numFrames = 5; // Change this to control cost & length
//     const framePaths = [];

//     for (let i = 0; i < numFrames; i++) {
//       const response = await openai.images.generate({
//         model: "dall-e-3",
//         prompt: text,
//         size: "1024x1024",
//         n: 1,
//       });

//       const imageUrl = response.data[0].url;
//       const imgRes = await fetch(imageUrl);
//       const arrayBuffer = await imgRes.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);

//       const imgFilename = `frame_${i}.png`;
//       const imgPath = path.join(framesDir, imgFilename);
//       fs.writeFileSync(imgPath, buffer);
//       framePaths.push(imgPath);
//     }

//     // Directory for final video
//     const videoDir = path.join(process.cwd(), "public", "uploads", "text-to-video");
//     if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

//     const videoFilename = `${uuidv4()}.mp4`;
//     const videoFilepath = path.join(videoDir, videoFilename);
//     const relativeVideoPath = `/uploads/text-to-video/${videoFilename}`;

//     // Create video from frames using ffmpeg
//     const ffmpegCmd = `ffmpeg -y -framerate 1 -pattern_type glob -i '${framesDir}/frame_*.png' -c:v libx264 -pix_fmt yuv420p -r 30 "${videoFilepath}"`;
//     execSync(ffmpegCmd);

//     // Clean up temporary frames
//     framePaths.forEach(p => fs.unlinkSync(p));
//     fs.rmdirSync(framesDir);

//     // Save user log
//     const newLog = new TextToVideoUsers({
//       userId: userData._id,
//       email: userData.email,
//     });

//     const savedLog = await newLog.save();
//     if (!savedLog) {
//       return serverErrorResponse("Failed to save user activity log.");
//     }

//     return successResponse("Video generated successfully", {
//       videoPath: relativeVideoPath,
//     });
//   } catch (err) {
//     console.error("Text-to-Video error:", err);
//     return serverErrorResponse("Error generating video: " + (err.message || err));
//   }
// }

// import fs from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { execSync } from "child_process";
// import {
//   successResponse,
//   badRequestResponse,
//   serverErrorResponse,
//   notFoundResponse,
// } from "../../helper/apiResponseHelpers";

// import { Users } from "@/app/config/Models/Users/users";
// import { TextToVideoUsers } from "@/app/config/Models/TextToVideoUsers/TextToVideoUsers";
// import serverSideValidation from "@/app/helper/serverSideValidation";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// function validatePrompt(prompt) {
//   if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
//     return { error: "Prompt is required and must be a non-empty string." };
//   }
//   return { error: null };
// }

// export async function POST(req) {
//   try {
//     const token = serverSideValidation.extractAuthToken(req);
//     if (typeof token !== "string") {
//       return notFoundResponse("Token not found or invalid.", null);
//     }

//     console.log("Token:", token);

//     const user = await serverSideValidation.validateUserByToken(token);
//     if (user && user.status) return user;
//     if (!user || !user._id) {
//       return notFoundResponse("User not found or invalid token.", null);
//     }

//     console.log("User:", user);

//     const userData = await Users.findById(user._id);
//     if (!userData) {
//       return notFoundResponse("User not found.", null);
//     }

//     console.log("User Data:", userData);

//     const { text } = await req.json();

//     console.log("Received text:", text);

//     const { error } = validatePrompt(text);
//     if (error) {
//       return badRequestResponse(error, null);
//     }

//     // Directories
//     const framesDir = path.join(process.cwd(), "public", "uploads", "text-to-video-temp");
//     const videoDir = path.join(process.cwd(), "public", "uploads", "text-to-video");

//     console.log("Frames directory:", framesDir);
//     console.log("Video directory:", videoDir);

//     if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });
//     if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

//     const numFrames = 5; // Low cost: fewer frames

//     // Generate frames
//     for (let i = 0; i < numFrames; i++) {
//       const response = await openai.images.generate({
//         model: "dall-e-2",
//         prompt: `${text}, cinematic frame ${i + 1}`,
//         size: "512x512",
//         n: 1,
//       });

//       console.log(`Generated frame ${i + 1}:`, response);

//       const imageUrl = response.data[0].url;
//       console.log("Image URL:", imageUrl);

//       const imgRes = await fetch(imageUrl);

//       if (!imgRes.ok) {
//         throw new Error(`Failed to fetch image: ${imgRes.status} ${imgRes.statusText}`);
//       }

//       const contentType = imgRes.headers.get("content-type");
//       if (!contentType || !contentType.startsWith("image/")) {
//         throw new Error(`Invalid content-type: ${contentType}`);
//       }

//       const arrayBuffer = await imgRes.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);

//       const imgPath = path.join(framesDir, `frame_${i}.png`);
//       fs.writeFileSync(imgPath, buffer);

//     }

//     // Video file path
//     const videoFilename = `${uuidv4()}.mp4`;
//     const videoFilepath = path.join(videoDir, videoFilename);
//     const relativeVideoPath = `/uploads/text-to-video/${videoFilename}`;

//     // Create video with ffmpeg
//     const ffmpegCmd = `ffmpeg -y -framerate 1 -pattern_type glob -i '${framesDir}/frame_*.png' -c:v libx264 -pix_fmt yuv420p -r 30 "${videoFilepath}"`;
//     execSync(ffmpegCmd, { stdio: "inherit" });

//     // Clean frames
//     fs.readdirSync(framesDir).forEach(file => {
//       fs.unlinkSync(path.join(framesDir, file));
//     });
//     fs.rmdirSync(framesDir);

//     // Save log
//     const newLog = new TextToVideoUsers({
//       userId: userData._id,
//       email: userData.email,
//     });

//     const savedLog = await newLog.save();
//     if (!savedLog) {
//       return serverErrorResponse("Failed to save user activity log.");
//     }

//     return successResponse("Video generated successfully", {
//       videoPath: relativeVideoPath,
//     });
//   } catch (err) {
//     console.error("Text-to-Video error:", err);
//     return serverErrorResponse("Error generating video: " + (err.message || err));
//   }
// }


import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { execSync } from "child_process";
import {
  successResponse,
  badRequestResponse,
  serverErrorResponse,
  notFoundResponse,
} from "../../helper/apiResponseHelpers";

import { Users } from "@/app/config/Models/Users/users";
import { TextToVideoUsers } from "@/app/config/Models/TextToVideoUsers/TextToVideoUsers";
import serverSideValidation from "@/app/helper/serverSideValidation";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function validatePrompt(prompt) {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return { error: "Prompt is required and must be a non-empty string." };
  }
  return { error: null };
}

export async function POST(req) {
  try {
    const token = serverSideValidation.extractAuthToken(req);
    if (typeof token !== "string") {
      return notFoundResponse("Token not found or invalid.", null);
    }

    console.log("Token:", token);

    const user = await serverSideValidation.validateUserByToken(token);
    if (user && user.status) return user;
    if (!user || !user._id) {
      return notFoundResponse("User not found or invalid token.", null);
    }

    console.log("User:", user);

    const userData = await Users.findById(user._id);
    if (!userData) {
      return notFoundResponse("User not found.", null);
    }

    console.log("User Data:", userData);

    const { text } = await req.json();

    console.log("Received text:", text);

    const { error } = validatePrompt(text);
    if (error) {
      return badRequestResponse(error, null);
    }

    // Directories
    const framesDir = path.join(process.cwd(), "public", "uploads", "text-to-video-temp");
    const videoDir = path.join(process.cwd(), "public", "uploads", "text-to-video");

    console.log("Frames directory:", framesDir);
    console.log("Video directory:", videoDir);

    if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

    const numFrames = 5; // Number of frames

    // Generate frames
    for (let i = 0; i < numFrames; i++) {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `${text}, cinematic frame ${i + 1}`,
        size: "1024x1024",
        n: 1,
      });

      // const response = await openai.images.generate({
      //   model: "dall-e-3",
      //   prompt: `${text}, cinematic frame ${i + 1}`,
      //   size: "1024x1024",
      //   n: 1,
      // });

      console.log(`Generated frame ${i + 1}:`, response);

      const imageUrl = response.data[0].url;
      console.log("Image URL:", imageUrl);

      const imgRes = await fetch(imageUrl);

      if (!imgRes.ok) {
        throw new Error(`Failed to fetch image: ${imgRes.status} ${imgRes.statusText}`);
      }

      const contentType = imgRes.headers.get("content-type");
      if (!contentType || !contentType.startsWith("image/")) {
        throw new Error(`Invalid content-type: ${contentType}`);
      }

      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Use 1-based index for Windows compatibility
      const imgPath = path.join(framesDir, `frame_${i + 1}.png`);
      fs.writeFileSync(imgPath, buffer);
    }

    // Video file path
    const videoFilename = `${uuidv4()}.mp4`;
    const videoFilepath = path.join(videoDir, videoFilename);
    const relativeVideoPath = `/uploads/text-to-video/${videoFilename}`;

    // Create video with ffmpeg (Windows fix: no glob, use %d pattern)
    const ffmpegCmd = `ffmpeg -y -framerate 1 -i "${framesDir}/frame_%d.png" -c:v libx264 -pix_fmt yuv420p -r 30 "${videoFilepath}"`;
    console.log("Running ffmpeg command:", ffmpegCmd);
    execSync(ffmpegCmd, { stdio: "inherit" });

    // Clean frames
    fs.readdirSync(framesDir).forEach(file => {
      fs.unlinkSync(path.join(framesDir, file));
    });
    fs.rmdirSync(framesDir);

    // Save log
    const newLog = new TextToVideoUsers({
      userId: userData._id,
      email: userData.email,
    });

    const savedLog = await newLog.save();
    if (!savedLog) {
      return serverErrorResponse("Failed to save user activity log.");
    }

    return successResponse("Video generated successfully", {
      videoPath: relativeVideoPath,
    });
  } catch (err) {
    console.error("Text-to-Video error:", err);
    return serverErrorResponse("Error generating video: " + (err.message || err));
  }
}


export async function GET(req) {
  try {
    const token = serverSideValidation.extractAuthToken(req);

    if (typeof token !== "string") {
      return notFoundResponse("Token not found or invalid.", null);
    }

    console.log("Token:", token);

    const user = await serverSideValidation.validateAdminByToken(token);

    console.log("User:", user);

    // Check if it's a NextResponse object (error), then return it directly
    if (user && user.status) {
      return user;
    }

    if (!user || !user._id) {
      return notFoundResponse("User not found or invalid token.", null);
    }

    const id = user._id;

    // Find user by id
    const userData = await Users.findById(id);

    console.log("User Data:", userData);

    if (!userData) {
      return notFoundResponse("User not found.", null);
    }

    const {
      search = "",
      pageNumber = 1,
      pageSize = 5,
    } = Object.fromEntries(req.nextUrl.searchParams);

    console.log("Search:", search);
    console.log("Page Number:", pageNumber);
    console.log("Page Size:", pageSize);

    var filters = search
      ? { email: { $regex: search, $options: "i" }, role: { $ne: "admin" } }
      : { role: { $ne: "admin" } };

    const page = parseInt(pageNumber);
    const size = parseInt(pageSize);

    const skip = (page - 1) * size;

    const users = await TextToVideoUsers.find(filters).skip(skip).limit(size);
    const totalUsersCount = await TextToVideoUsers.countDocuments(filters);

    if (!users || users.length === 0) {
      return successResponse("No users found", null);
    }

    console.log("Users:", users);

    return successResponse("Users retrieved successfully", {
      users,
      totalUsersCount,
      pageNumber: page,
      pageSize: size,
    });
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}
