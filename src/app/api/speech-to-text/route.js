// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import { v4 as uuidv4 } from 'uuid';
// import axios from 'axios';
// import {
//     successResponse,
//     badRequestResponse,
//     serverErrorResponse
// } from '../../helper/apiResponseHelpers';

// import { Users } from "@/app/config/Models/Users/users";
// import { SpeechToTextUsers } from "@/app/config/Models/SpeechToTextUsers/SpeechToTextUsers";
// import { NextResponse } from "next/server";
// import serverSideValidation from "@/app/helper/serverSideValidation";
// import OpenAI from "openai";
// import fs from "fs";
// import path from "path";

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// // 1) Ensure Node runtime for any fs operations
// export const runtime = 'nodejs';

// // 2) Limit request body size (20 MB)
// export const requestBody = {
//     sizeLimit: 20 * 1024 * 1024,
// };

// export async function POST(request) {
//     try {
//         const token = serverSideValidation.extractAuthToken(req);

//         if (typeof token !== "string") {
//             return notFoundResponse("Token not found or invalid.", null);
//         }

//         console.log("Token:", token);

//         const user = await serverSideValidation.validateUserByToken(token);

//         console.log("User:", user);

//         // Check if it's a NextResponse object (error), then return it directly
//         if (user && user.status) {
//             return user;
//         }

//         if (!user || !user._id) {
//             return notFoundResponse("User not found or invalid token.", null);
//         }


//         console.log("User:", user);

//         const id = user._id;

//         if (!id) {
//             return NextResponse.json(
//                 { success: false, message: "User ID not found." },
//                 { status: 404 }
//             );
//         }

//         // Find user by id
//         const userData = await Users.findById(id);

//         console.log("User Data:", userData);

//         if (!userData) {
//             return notFoundResponse("User not found.", null);
//         }

//         // 3) Parse multipart form data via Web API
//         const formData = await request.formData();
//         const file = formData.get('audio') || formData.get('file');

//         console.log("file: ", file);

//         if (!(file instanceof File)) {
//             return badRequestResponse('Audio file is required.', null);
//         }

//         // 4) Read file into Buffer
//         const arrayBuffer = await file.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);

//         console.log("buffer: ", buffer);
//         console.log("arrayBuffer: ", arrayBuffer);

//         // 5) Send to Hugging Face Whisper
//         const hfRes = await axios.post(
//             'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
//             buffer,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
//                     'Content-Type': file.type,
//                     'Accept': 'application/json'
//                 }
//             }
//         );

//         console.log("hfRes: ", hfRes);
//         console.log("hfRes: ", hfRes.data);
//         console.log("hfRes: ", hfRes.data.text);

//         if (!hfRes.data.text) {
//             return badRequestResponse("No transcription text returned from Whisper.", null);
//         }

//         // Save user activity log
//         const newLog = new SpeechToTextUsers({
//             userId: userData._id,
//             email: userData.email,
//         });

//         const savedLog = await newLog.save();

//         if (!savedLog) {
//             return serverErrorResponse("Failed to save user activity log.");
//         }

//         // 6) Return transcription
//         return successResponse("Speech-to-Text successful", {
//             transcription: hfRes.data.text,
//         });
//     } catch (err) {
//         console.log("Error in Speech-to-Text API:", err);
//         console.error('Speech-to-Text error:', err.response?.data || err.message || err);
//         return serverErrorResponse(
//             'Error transcribing audio: ' + (err.response?.data?.error || err.message || String(err)),
//             null
//         );
//     }
// }

// with open ai

import {
    successResponse,
    badRequestResponse,
    serverErrorResponse,
    notFoundResponse,
} from "../../helper/apiResponseHelpers";
import { Users } from "@/app/config/Models/Users/users";
import { SpeechToTextUsers } from "@/app/config/Models/SpeechToTextUsers/SpeechToTextUsers";
import serverSideValidation from "@/app/helper/serverSideValidation";
import OpenAI from "openai";
import streamifier from "streamifier";
import { uploadFileToS3 } from "@/app/helper/s3Helpers/s3Helper.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    try {
        const token = serverSideValidation.extractAuthToken(request);
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

        const formData = await request.formData();
        const file = formData.get("audio") || formData.get("file");
        if (!(file instanceof File)) {
            return badRequestResponse("Audio file is required.", null);
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert buffer to stream for OpenAI
        const stream = streamifier.createReadStream(buffer);
        stream.path = file.name; // OpenAI API needs path property

        // Send to OpenAI Whisper
        const transcription = await openai.audio.transcriptions.create({
            file: stream,
            model: "whisper-1",
        });

        if (!transcription.text) {
            return badRequestResponse("No transcription text returned.", null);
        }

        // Upload audio to S3 (folder: voice-to-text)
        const s3Url = await uploadFileToS3(buffer, "voice-to-text", "mp3", "audio/mpeg");

        // Find last record to get count
        const lastRecord = await SpeechToTextUsers.findOne({ userId: userData._id }).sort({ createdAt: -1 });

        let newCount = 1;
        if (lastRecord && lastRecord.count) {
            newCount = lastRecord.count + 1;
        }

        // Save new record
        const newLog = new SpeechToTextUsers({
            userId: userData._id,
            email: userData.email,
            voiceUrl: s3Url,
            text: transcription.text,
            count: newCount,
        });

        await newLog.save();

        return successResponse("Speech-to-Text successful", {
            transcription: transcription.text,
        });
    } catch (err) {
        console.error("Speech-to-Text error:", err);
        return serverErrorResponse("Error transcribing audio: " + (err.message || String(err)), null);
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

        const users = await SpeechToTextUsers.find(filters).skip(skip).limit(size);
        const totalUsersCount = await SpeechToTextUsers.countDocuments(filters);

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


