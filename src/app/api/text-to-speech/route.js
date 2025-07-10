// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import gTTS from "gtts";
// import {
//   successResponse,
//   badRequestResponse,
//   serverErrorResponse,
// } from "../../helper/apiResponseHelpers";

// import { Users } from "@/app/config/Models/Users/users";
// import { TextToSpeechUsers } from "@/app/config/Models/TextToSpeechUsers/TextToSpeechUsers";
// import { NextResponse } from "next/server";
// import serverSideValidation from "@/app/helper/serverSideValidation";
// import OpenAI from "openai";
// import fs from "fs";
// import path from "path";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Text validation helper
// function validateText(data) {
//   if (!data?.text || typeof data.text !== "string" || data.text.trim() === "") {
//     return { error: "Text field is required and must be a non-empty string." };
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

//     // const user = await serverSideValidation.validateUserByToken(token);

//     // if (!user) {
//     //     return notFoundResponse("User not found or invalid token.", null);
//     // }

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

//     const { text } = await req.json();

//     const { error } = validateText({ text });
//     if (error) {
//       return badRequestResponse(error, null);
//     }

//     const uploadDir = path.join(process.cwd(), "public", "uploads", "text-to-speech");

//     // Create directory if it doesn't exist
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const filename = `${uuidv4()}.mp3`;
//     const filepath = path.join(uploadDir, filename);
//     const relativePath = `/uploads/text-to-speech/${filename}`;

//     const gtts = new gTTS(text, "en");

//     await new Promise((resolve, reject) => {
//       gtts.save(filepath, function (err) {
//         if (err) return reject(err);
//         resolve();
//       });
//     });

//     return successResponse("Voice generated successfully", {
//       voicePath: relativePath,
//     });
//   } catch (error) {
//     return serverErrorResponse("Error generating voice: " + error.message);
//   }
// }

// with open ai

import { NextResponse } from "next/server";
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
import { TextToSpeechUsers } from "@/app/config/Models/TextToSpeechUsers/TextToSpeechUsers";
import serverSideValidation from "@/app/helper/serverSideValidation";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Text validation helper
function validateText(data) {
  if (!data?.text || typeof data.text !== "string" || data.text.trim() === "") {
    return { error: "Text field is required and must be a non-empty string." };
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

    console.log("User:", user);

    if (user && user.status) {
      return user;
    }

    if (!user || !user._id) {
      return notFoundResponse("User not found or invalid token.", null);
    }

    const id = user._id;

    const userData = await Users.findById(id);

    console.log("User Data:", userData);

    if (!userData) {
      return notFoundResponse("User not found.", null);
    }

    const { text } = await req.json();

    const { error } = validateText({ text });
    if (error) {
      return badRequestResponse(error, null);
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "text-to-speech");

    // Create directory if not exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${uuidv4()}.mp3`;
    const filepath = path.join(uploadDir, filename);
    const relativePath = `/uploads/text-to-speech/${filename}`;

    // Call OpenAI TTS
    const audioRes = await openai.audio.speech.create({
      model: "tts-1", // Use tts-1 for low cost and good quality (or tts-1-hd for higher quality)
      voice: "alloy", // Voices: alloy, onyx, echo, etc. (currently alloy is default and widely supported)
      input: text,
      format: "mp3",
    });

    const buffer = Buffer.from(await audioRes.arrayBuffer());

    fs.writeFileSync(filepath, buffer);

    console.log("Audio file saved at:", filepath);

    // Save user log
    const newLog = new TextToSpeechUsers({
      userId: userData._id,
      email: userData.email,
    });

    const savedLog = await newLog.save();

    if (!savedLog) {
      return serverErrorResponse("Failed to save user activity log.");
    }

    return successResponse("Voice generated successfully", {
      voicePath: relativePath,
    });
  } catch (error) {
    console.error("Error generating voice:", error);
    return serverErrorResponse("Error generating voice: " + error.message, null);
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

    const users = await TextToSpeechUsers.find(filters).skip(skip).limit(size);
    const totalUsersCount = await TextToSpeechUsers.countDocuments(filters);

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
