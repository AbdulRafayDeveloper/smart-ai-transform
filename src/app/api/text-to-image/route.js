// import axios from "axios";
// import { v4 as uuidv4 } from "uuid";
// import {
//   PutObjectCommand,
// } from "@aws-sdk/client-s3";
// import s3Client from "@/app/config/s3.js";
// import {
//   successResponse,
//   badRequestResponse,
//   serverErrorResponse,
// } from "@/app/helper/apiResponseHelpers";

// const HF_TOKEN = process.env.HF_API_TOKEN;
// const MODEL_ID = "black-forest-labs/FLUX.1-dev";
// const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
// const PROJECT_NAME = process.env.PROJECT_NAME || "Smart-Transform";

// export async function POST(req) {
//   try {
//     const { text } = await req.json();

//     if (!text?.trim()) {
//       return badRequestResponse("Text field is required and must be a non-empty string.", null);
//     }

//     console.log("Prompt:", text);

//     // Hugging Face image generation
//     const hfRes = await axios.post(
//       `https://api-inference.huggingface.co/models/${MODEL_ID}`,
//       { inputs: text },
//       {
//         responseType: "arraybuffer",
//         headers: {
//           Authorization: `Bearer ${HF_TOKEN}`,
//           Accept: "image/png",
//           "Content-Type": "application/json",
//         },
//         timeout: 300_000,
//       }
//     );

//     console.log("Hugging Face response received");

//     // Generate filename
//     const key = `${PROJECT_NAME}/text-to-image/${uuidv4()}.png`;

//     console.log("Generated filename:", key);

//     // Upload to S3
//     const uploadParams = {
//       Bucket: BUCKET_NAME,
//       Key: key,
//       Body: Buffer.from(hfRes.data),
//       ContentType: "image/png",
//       ACL: "public-read",
//       ContentDisposition: "attachment"
//     };

//     console.log("Uploading to S3 with params:", uploadParams);

//     await s3Client.send(new PutObjectCommand(uploadParams));
//     console.log("Uploaded to S3:", key);

//     const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

//     console.log("Image URL:", imageUrl);

//     return successResponse("Image generated & uploaded successfully", {
//       imageUrl,
//     });
//   } catch (err) {
//     console.error("Text-to-Image error:", err);
//     let msg = err.message;

//     if (err.response?.headers["content-type"]?.includes("application/json")) {
//       try {
//         const json = JSON.parse(Buffer.from(err.response.data).toString("utf8"));
//         msg = json.error || JSON.stringify(json);
//       } catch { }
//     }

//     if (err.response?.status === 503) {
//       console.error("Text-to-Image error (503): Service unavailable");
//       return serverErrorResponse("The model service is temporarily unavailable (503). Please try again later.", null);
//     }

//     if (err.response?.status === 504) {
//       console.error("Text-to-Image error (504): Gateway timeout");
//       return serverErrorResponse("The request to generate an image timed out (504). Please try again after some time.", null);
//     }

//     console.error("Text-to-Image error:", msg);
//     return serverErrorResponse("Error generating image: " + msg, null);
//   }
// }

// ========= practice code ===========

// // huugging face model

// import axios from "axios";
// import fs from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import {
//   successResponse,
//   badRequestResponse,
//   serverErrorResponse,
// } from "../../helper/apiResponseHelpers";

// const HF_TOKEN = process.env.HF_API_TOKEN;
// const MODEL_ID = "black-forest-labs/FLUX.1-dev";

// export async function POST(req, res) {
//   try {
//     // 1) Parse JSON payload
//     const { text } = await req.json();
//     if (!text?.trim()) {
//       return badRequestResponse(
//         "Text field is required and must be a non-empty string.",
//         null
//       )
//     }

//     console.log("Prompt:", text);

//     // 2) Call the model endpoint directly, asking for image/png
//     const hfRes = await axios.post(
//       `https://api-inference.huggingface.co/models/${MODEL_ID}`,
//       { inputs: text },
//       {
//         responseType: "arraybuffer",
//         headers: {
//           Authorization: `Bearer ${HF_TOKEN}`,
//           Accept: "image/png",               // ← request PNG bytes
//           "Content-Type": "application/json" // payload is JSON
//         },
//         // allow a longer timeout for image generation
//         timeout: 300_000
//       }
//     );

//     // 3) Save the PNG bytes
//     const uploadDir = path.join(
//       process.cwd(),
//       "public",
//       "uploads",
//       "text-to-image"
//     );
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//     const filename = `${uuidv4()}.png`;
//     const filepath = path.join(uploadDir, filename);
//     fs.writeFileSync(filepath, hfRes.data);
//     console.log("Saved image to", filepath);

//     // 4) Return the relative path
//     return successResponse("Image generated successfully", {
//       imagePath: `/uploads/text-to-image/${filename}`,
//     })
//   } catch (err) {
//     let msg = err.message;

//     // Decode HF error if JSON
//     if (err.response?.headers["content-type"]?.includes("application/json")) {
//       try {
//         const json = JSON.parse(Buffer.from(err.response.data).toString("utf8"));
//         msg = json.error || JSON.stringify(json);
//       } catch { }
//     }

//     // Handle specific status codes
//     if (err.response?.status === 503) {
//       console.error("Text-to-Image error (503): Service unavailable");
//       return serverErrorResponse(
//         "The model service is temporarily unavailable (503). Please try again later.",
//         null
//       );
//     }

//     if (err.response?.status === 504) {
//       console.error("Text-to-Image error (504): Gateway timeout");
//       return serverErrorResponse(
//         "The request to generate an image timed out (504). Please try again after some time.",
//         null
//       );
//     }

//     console.error("Text-to-Image error:", msg);
//     return serverErrorResponse(
//       "Error generating image: " + msg,
//       null
//     );
//   }
// }


// with open ai

import {
  successResponse,
  badRequestResponse,
  serverErrorResponse,
  notFoundResponse,
} from "../../helper/apiResponseHelpers";
import { Users } from "@/app/config/Models/Users/users";
import { TextToImageUsers } from "@/app/config/Models/TextToImageUsers/TextToImageUsers";
import { NextResponse } from "next/server";
import serverSideValidation from "@/app/helper/serverSideValidation";
import OpenAI from "openai";
import { uploadFileToS3 } from "@/app/helper/s3Helpers/s3Helper.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const token = serverSideValidation.extractAuthToken(req);

    if (typeof token !== "string") {
      return notFoundResponse("Token not found or invalid.", null);
    }

    const user = await serverSideValidation.validateUserByToken(token);
    if (user && user.status) return user;

    if (!user || !user._id) {
      return notFoundResponse("User not found or invalid token.", null);
    }

    const userData = await Users.findById(user._id);
    if (!userData) {
      return notFoundResponse("User not found.", null);
    }

    const { text } = await req.json();
    if (!text?.trim()) {
      return badRequestResponse("Text field is required and must be non-empty.", null);
    }

    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: text,
      size: "512x512",
      n: 1,
    });

    const openAiImageUrl = response.data[0].url;
    const imageRes = await fetch(openAiImageUrl);
    if (!imageRes.ok) {
      throw new Error("Failed to download image from OpenAI URL.");
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // helper function ko store image in S3 Bucket
    const imageUrl = await uploadFileToS3(buffer, "text-to-image", "png", "image/png");

    // Find last record to get count
    const lastRecord = await TextToImageUsers.findOne({ userId: userData._id }).sort({ createdAt: -1 });

    let newCount = 1;
    if (lastRecord && lastRecord.count) {
      newCount = lastRecord.count + 1;
    }

    // Create new record
    const newLog = new TextToImageUsers({
      userId: userData._id,
      email: userData.email,
      count: newCount,
      text: text,
      imageUrl: imageUrl,
    });

    await newLog.save();

    return successResponse("Image generated successfully", { imageUrl });
  } catch (err) {
    console.error("Text-to-Image error:", err);
    return serverErrorResponse("Error generating image: " + err.message, null);
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

    const users = await TextToImageUsers.find(filters).skip(skip).limit(size);
    const totalUsersCount = await TextToImageUsers.countDocuments(filters);

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

