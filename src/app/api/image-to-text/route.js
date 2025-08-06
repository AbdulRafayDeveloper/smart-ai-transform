// import { successResponse, badRequestResponse, serverErrorResponse, notFoundResponse, conflictResponse, unsupportedMediaTypeResponse } from "../../helper/apiResponseHelpers";
// import tesseract from "node-tesseract-ocr";
// import { Users } from "@/app/config/Models/Users/users";
// import { ImageToTextUsers } from "@/app/config/Models/ImageToTextUsers/ImageToTextUsers";
// import { NextResponse } from "next/server";
// import serverSideValidation from "@/app/helper/serverSideValidation";

// export async function POST(req) {
//     try {
//         const token = serverSideValidation.extractAuthToken(req);

//         if (typeof token !== "string") {
//             return notFoundResponse("Token not found or invalid.", null);
//         }

//         const user = await serverSideValidation.validateUserByToken(token);

//         if (!user) {
//             return notFoundResponse("User not found or invalid token.", null);
//         }

//         const id = user._id;
//         console.log(id);

//         if (!id) {
//             return NextResponse.json(
//                 { success: false, message: "User ID not found." },
//                 { status: 404 }
//             );
//         }

//         // find user by id
//         const userData = await Users.findById(id);

//         if (!userData) {
//             return notFoundResponse("User not found.", null);
//         }

//         const formData = await req.formData();
//         const file = formData.get("image");

//         if (!file || typeof file === "string") {
//             return badRequestResponse("Image file is required.", null);
//         }

//         const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//         if (!allowedTypes.includes(file.type)) {
//             return badRequestResponse("Only JPG, JPEG, and PNG images are allowed.", null);
//         }

//         if (file.size > 5 * 1024 * 1024) {
//             return badRequestResponse("File size should not exceed 5MB.", null);
//         }

//         const buffer = Buffer.from(await file.arrayBuffer());

//         // Save buffer to temp file
//         const fs = require("fs");
//         const path = require("path");
//         const tempPath = path.join(process.cwd(), "temp-image.png");
//         fs.writeFileSync(tempPath, buffer);

//         const text = await tesseract.recognize(tempPath, {
//             lang: "eng",
//         });

//         fs.unlinkSync(tempPath);

//         if (!text.trim()) {
//             return badRequestResponse("No text found in the image.", null);
//         }

//         // save user activity log
//         const newLog = new ImageToTextUsers({
//             userId: userData._id,
//             email: userData.email,
//         });

//         const savedLog = await newLog.save();

//         if (!savedLog) {
//             return serverErrorResponse("Failed to save user activity log.");
//         }

//         return successResponse("Text extracted successfully", { description: text.trim() });
//     } catch (error) {
//         console.error("OCR error:", error);
//         return serverErrorResponse("An error occurred while processing the image.");
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
import { ImageToTextUsers } from "@/app/config/Models/ImageToTextUsers/ImageToTextUsers";
import { NextResponse } from "next/server";
import serverSideValidation from "@/app/helper/serverSideValidation";
import OpenAI from "openai";
import { uploadFileToS3 } from "@/app/helper/s3Helpers/s3Helper.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

        const formData = await req.formData();
        const file = formData.get("image");

        if (!file || typeof file === "string") {
            return badRequestResponse("Image file is required.", null);
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            return badRequestResponse("Only JPG, JPEG, and PNG images are allowed.", null);
        }

        if (file.size > 5 * 1024 * 1024) {
            return badRequestResponse("File size should not exceed 5MB.", null);
        }

        // Convert to Buffer directly
        const buffer = Buffer.from(await file.arrayBuffer());

        // Convert buffer to base64
        const base64Image = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64Image}`;

        // Use OpenAI Vision to describe the image
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // or any vision-capable model
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Describe what is happening in this image in detail." },
                        {
                            type: "image_url",
                            image_url: {
                                url: dataUri,
                            },
                        },
                    ],
                },
            ],
        });

        const description = response.choices[0].message.content;

        if (!description || !description.trim()) {
            return badRequestResponse("Failed to generate image description.", null);
        }

        const imageUrl = await uploadFileToS3(buffer, "image-to-text", "png", "image/png");

        const lastRecord = await ImageToTextUsers.findOne({ userId: userData._id }).sort({ createdAt: -1 });

        let newCount = 1;
        if (lastRecord && lastRecord.count) {
            newCount = lastRecord.count + 1;
        }

        // Save user log
        const newLog = new ImageToTextUsers({
            userId: userData._id,
            email: userData.email,
            count: newCount,
            imageUrl: imageUrl,
            description: description,
        });

        await newLog.save();

        return successResponse("Image described successfully", { description });
    } catch (error) {
        console.error("Image description error:", error);
        return serverErrorResponse("An error occurred while describing the image.");
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

        const users = await ImageToTextUsers.find(filters).skip(skip).limit(size);
        const totalUsersCount = await ImageToTextUsers.countDocuments(filters);

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
