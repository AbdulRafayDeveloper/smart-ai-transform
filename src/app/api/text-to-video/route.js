// import fs from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { InferenceClient } from "@huggingface/inference";
// import { successResponse, badRequestResponse, serverErrorResponse } from "../../helper/apiResponseHelpers";
// import dotenv from "dotenv";
// import { Users } from "@/app/config/Models/Users/users";
// import { TextToVideoUsers } from "@/app/config/Models/TextToVideoUsers/TextToVideoUsers";
// import { NextResponse } from "next/server";
// import serverSideValidation from "@/app/helper/serverSideValidation";
// dotenv.config();

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

//     // const formData = await req.formData();
//     // const prompt = formData.get("text");

//     const body = await req.json();
//     const prompt = body.text;

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

//     const numFrames = 2; // Change this to control cost & length
//     const framePaths = [];

//     for (let i = 0; i < numFrames; i++) {
//       const response = await openai.images.generate({
//         model: "dall-e-2",
//         prompt: text,
//         size: "512x512",
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

// ===== ab

// import { v4 as uuidv4 } from "uuid";
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
// import ApiVideoClient from "@api.video/nodejs-sdk";
// import { uploadFileToS3 } from "@/app/helper/s3Helpers/s3Helper.js";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const apiVideoClient = new ApiVideoClient({ apiKey: process.env.API_VIDEO_API_KEY });

// function validatePrompt(prompt) {
//   if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
//     return { error: "Prompt is required and must be a non-empty string." };
//   }
//   return { error: null };
// }

// export async function POST(req) {
//   try {
//     // ✅ Validate user token
//     const token = serverSideValidation.extractAuthToken(req);
//     if (typeof token !== "string") return notFoundResponse("Token not found or invalid.", null);

//     const user = await serverSideValidation.validateUserByToken(token);
//     if (user && user.status) return user;
//     if (!user || !user._id) return notFoundResponse("User not found or invalid token.", null);

//     const userData = await Users.findById(user._id);
//     if (!userData) return notFoundResponse("User not found.", null);

//     // ✅ Parse prompt
//     const { text } = await req.json();
//     const { error } = validatePrompt(text);
//     if (error) return badRequestResponse(error, null);

//     // ✅ Generate image(s) from OpenAI
//     const numFrames = 2; // Or more if needed
//     const imageBuffers = [];

//     for (let i = 0; i < numFrames; i++) {
//       const response = await openai.images.generate({
//         model: "dall-e-2",
//         prompt: `${text}, cinematic frame ${i + 1}`,
//         size: "512x512",
//         n: 1,
//       });

//       const imageUrl = response.data[0].url;
//       const imgRes = await fetch(imageUrl);
//       if (!imgRes.ok) throw new Error(`Failed to fetch image: ${imgRes.status}`);

//       const arrayBuffer = await imgRes.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);
//       imageBuffers.push(buffer);
//     }

//     // Create a video on api.video
//     const video = await apiVideoClient.videos.create({
//       title: `Generated from text: ${text}`,
//       source: { type: "upload" },
//     });

//     console.log("Video created on api.video:", video);
//     console.log("Video ID:", video.videoId);

//     // if error occure in api.video upload, handle it
//     if (!video || !video.videoId) {
//       console.error("Failed to create video on api.video:", video);
//       throw new Error("Failed to create video on api.video");
//     }

//     console.log("Uploading video to api.video...");
//     // ✅ After video uploaded, get api.video playback URL
//     // const playbackUrl = video.assets.player;

//     // ✅ Download final video file
//     // const videoRes = await fetch(playbackUrl);
//     // const videoBuffer = Buffer.from(await videoRes.arrayBuffer());

//     // ✅ Upload to S3 using existing helper
//     // const s3Url = await uploadFileToS3(videoBuffer, "text-to-video", "mp4", "video/mp4");

//     // ✅ Save log
//     // const newLog = new TextToVideoUsers({
//     //   userId: userData._id,
//     //   email: userData.email,
//     // });
//     // const savedLog = await newLog.save();
//     // if (!savedLog) return serverErrorResponse("Failed to save user activity log.");

//     // ✅ Success response
//     // return successResponse("Video generated successfully", {
//     //   videoUrl: s3Url,
//     // });

//   } catch (err) {
//     console.error("Text-to-Video error:", err);
//     return serverErrorResponse("Error generating video: " + (err.message || err));
//   }
// }


// import { v4 as uuidv4 } from "uuid";
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
// import * as ShotstackSDK from "shotstack-sdk";
// import { uploadFileToS3 } from "@/app/helper/s3Helpers/s3Helper.js";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const ShotstackSDKAPIKEY = process.env.SHOTSTACK_API_KEY
// console.log("Shotstack API Key:", ShotstackSDKAPIKEY);
// // Setup Shotstack client
// const defaultClient = ShotstackSDK.ApiClient.instance;

// // Manually add authentication object if missing
// if (!defaultClient.authentications["apiKey"]) {
//   defaultClient.authentications["apiKey"] = { type: "apiKey", in: "header", name: "x-api-key", apiKey: "" };
// }

// const apiKeyObj = defaultClient.authentications["apiKey"];

// if (apiKeyObj && "apiKey" in apiKeyObj) {
//   apiKeyObj.apiKey = ShotstackSDKAPIKEY;
// } else {
//   console.error("❌ Shotstack API key object not found or invalid");
// }


// const editApi = new ShotstackSDK.EditApi();
// const serveApi = new ShotstackSDK.ServeApi();

// function validatePrompt(prompt) {
//   if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
//     return { error: "Prompt is required and must be a non-empty string." };
//   }
//   return { error: null };
// }

// export async function POST(req) {
//   try {
//     // ✅ Validate user token
//     const token = serverSideValidation.extractAuthToken(req);
//     if (typeof token !== "string") return notFoundResponse("Token not found or invalid.", null);

//     const user = await serverSideValidation.validateUserByToken(token);
//     if (user && user.status) return user;
//     if (!user || !user._id) return notFoundResponse("User not found or invalid token.", null);

//     const userData = await Users.findById(user._id);
//     if (!userData) return notFoundResponse("User not found.", null);

//     // ✅ Parse prompt
//     const { text } = await req.json();
//     const { error } = validatePrompt(text);
//     if (error) return badRequestResponse(error, null);

//     // ✅ Generate image from OpenAI
//     const response = await openai.images.generate({
//       model: "dall-e-2",
//       prompt: `${text}, cinematic style`,
//       size: "1024x1024",
//       n: 1,
//     });

//     const imageUrl = response.data[0].url;
//     if (!imageUrl) return serverErrorResponse("Failed to generate image.", null);

//     // ✅ Build Shotstack edit
//     const clip = new ShotstackSDK.Clip();
//     const imageAsset = new ShotstackSDK.ImageAsset();
//     imageAsset.src = imageUrl;
//     clip.asset = imageAsset;
//     clip.start = 0;
//     clip.length = 5; // 5 seconds

//     const track = new ShotstackSDK.Track();
//     track.clips = [clip];

//     const timeline = new ShotstackSDK.Timeline();
//     timeline.tracks = [track];

//     const output = new ShotstackSDK.Output();
//     output.format = "mp4";
//     output.resolution = "sd";

//     const edit = new ShotstackSDK.Edit();
//     edit.timeline = timeline;
//     edit.output = output;

//     // ✅ Send render request
//     const renderResponse = await editApi.postRender(edit);
//     const renderId = renderResponse.response.id;

//     if (!renderId) return serverErrorResponse("Failed to create render.", null);

//     console.log("Shotstack render started:", renderId);

//     // ✅ Poll render status until done
//     let status = "queued";
//     let videoUrl = "";

//     while (status === "queued" || status === "rendering") {
//       console.log(`Polling render status: ${status}`);
//       await new Promise((r) => setTimeout(r, 5000)); // Wait 5 sec

//       const renderDetails = await serveApi.getRender(renderId);
//       status = renderDetails.response.status;

//       if (status === "done") {
//         videoUrl = renderDetails.response.url;
//         console.log("Render complete:", videoUrl);
//       } else if (status === "failed") {
//         return serverErrorResponse("Shotstack render failed.", null);
//       }
//     }

//     if (!videoUrl) return serverErrorResponse("Video URL not received.", null);

//     // ✅ Download video and upload to S3
//     const videoRes = await fetch(videoUrl);
//     const videoBuffer = Buffer.from(await videoRes.arrayBuffer());

//     const s3Url = await uploadFileToS3(videoBuffer, "text-to-video", "mp4", "video/mp4");

//     // ✅ Save log
//     const newLog = new TextToVideoUsers({
//       userId: userData._id,
//       email: userData.email,
//     });
//     const savedLog = await newLog.save();
//     if (!savedLog) return serverErrorResponse("Failed to save user activity log.", null);

//     return successResponse("Video generated successfully", {
//       videoUrl: s3Url,
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
import { uploadFileToS3 } from "@/app/helper/s3Helpers/s3Helper.js";

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
    if (typeof token !== "string") return notFoundResponse("Token not found or invalid.", null);

    const user = await serverSideValidation.validateUserByToken(token);
    if (user && user.status) return user;
    if (!user || !user._id) return notFoundResponse("User not found or invalid token.", null);

    const userData = await Users.findById(user._id);
    if (!userData) return notFoundResponse("User not found.", null);

    const { text } = await req.json();
    const { error } = validatePrompt(text);
    if (error) return badRequestResponse(error, null);

    // Directories
    const framesDir = path.join(process.cwd(), "temp-video-frames");
    const videoTempFile = path.join(process.cwd(), `temp-video-${uuidv4()}.mp4`);

    if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

    const numFrames = 3;
    for (let i = 0; i < numFrames; i++) {
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: `${text}, cinematic frame ${i + 1}`,
        size: "512x512",
        n: 1,
      });

      const imageUrl = response.data[0].url;
      const imgRes = await fetch(imageUrl);

      if (!imgRes.ok) throw new Error(`Failed to fetch image: ${imgRes.status}`);

      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const imgPath = path.join(framesDir, `frame_${i + 1}.png`);
      fs.writeFileSync(imgPath, buffer);
    }

    const ffmpegCmd = `ffmpeg -y -framerate 1 -i "${framesDir}/frame_%d.png" -c:v libx264 -pix_fmt yuv420p -r 30 "${videoTempFile}"`;
    execSync(ffmpegCmd, { stdio: "inherit" });

    fs.readdirSync(framesDir).forEach(file => fs.unlinkSync(path.join(framesDir, file)));
    fs.rmdirSync(framesDir);

    const videoBuffer = fs.readFileSync(videoTempFile);

    // Upload to S3 using same helper
    const s3Url = await uploadFileToS3(videoBuffer, "text-to-video", "mp4", "video/mp4");

    // Delete temp video file
    fs.unlinkSync(videoTempFile);

    // Find last record to get count
    const lastRecord = await TextToVideoUsers.findOne({ userId: userData._id }).sort({ createdAt: -1 });

    let newCount = 1;
    if (lastRecord && lastRecord.count) {
      newCount = lastRecord.count + 1;
    }

    // Save log
    const newLog = new TextToVideoUsers({
      userId: userData._id,
      email: userData.email,
      count: newCount,
      text: text,
      videoUrl: s3Url,
    });

    await newLog.save();

    console.log("Video generated and uploaded to S3:", s3Url);

    return successResponse("Video generated successfully", {
      videoUrl: s3Url,
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
