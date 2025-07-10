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

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const token = serverSideValidation.extractAuthToken(req);

    if (typeof token !== "string") {
      return notFoundResponse("Token not found or invalid.", null);
    }

    console.log("Token:", token);

    const user = await serverSideValidation.validateUserByToken(token);

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

    // Parse JSON payload
    const { text } = await req.json();
    if (!text?.trim()) {
      return badRequestResponse("Text field is required and must be non-empty.", null);
    }

    console.log("Prompt:", text);

    // Generate image using OpenAI
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: text,
      size: "512x512",
      n: 1,
    });

    // // Generate image using OpenAI
    // const response = await openai.images.generate({
    //   model: "dall-e-3",         
    //   prompt: text,
    //   size: "1024x1024",
    //   n: 1,
    // });

    console.log("OpenAI image response:", response);

    const imageUrl = response.data[0].url;

    // Download image from URL
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error("Failed to download image from OpenAI URL.");
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to local folder
    const uploadDir = path.join(process.cwd(), "public", "uploads", "text-to-image");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `${uuidv4()}.png`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);
    console.log("Saved image to", filepath);

    // Save user activity log
    const newLog = new TextToImageUsers({
      userId: userData._id,
      email: userData.email,
    });

    const savedLog = await newLog.save();

    if (!savedLog) {
      return serverErrorResponse("Failed to save user activity log.");
    }

    return successResponse("Image generated successfully", {
      imagePath: `/uploads/text-to-image/${filename}`,
    });
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

