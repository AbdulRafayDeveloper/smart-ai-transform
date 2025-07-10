// // src/app/api/text-to-image/route.js

// import axios from "axios";
// import { NextResponse } from "next/server";

// // HuggingFace API config
// const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";
// const HUGGINGFACE_API_TOKEN = "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"; // .env.local file mein yeh token store karo

// const hfApi = axios.create({
//   baseURL: "https://api-inference.huggingface.co/models/",
//   headers: {
//     Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
//   },
// });

// // async function logUsage(username, modelId) {
// //   console.log(`User: ${username} used model: ${modelId}`);
// //   // Tum yahan apna database mein log bhi kar sakte ho future mein
// // }

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { text } = body;

//     if (!text) {
//       return NextResponse.json({ error: "Text prompt is required." }, { status: 400 });
//     }

//     const modelId = "black-forest-labs/FLUX.1-dev";

//     // API Call to HuggingFace
//     const response = await hfApi.post(
//       `${modelId}`,
//       { inputs: text },
//       { responseType: "arraybuffer" }
//     );

//     // await logUsage(username, modelId);

//     // Send the image data
//     return new NextResponse(response.data, {
//       status: 200,
//       headers: {
//         "Content-Type": "image/png",
//       },
//     });
//   } catch (error) {
//     console.error("Text-to-Image error:", error.response ? error.response.data : error.message);
//     return NextResponse.json({ error: "Error generating image." }, { status: 500 });
//   }
// }


// src/app/api/text-to-image/route.js

import axios from "axios";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import {
  successResponse,
  badRequestResponse,
  serverErrorResponse,
} from "../../helper/apiResponseHelpers"; // ✅ Correct import

// HuggingFace API config
const HUGGINGFACE_API_TOKEN = process.env.HF_API_TOKEN;

const hfApi = axios.create({
  baseURL: "https://api-inference.huggingface.co/models/",
  headers: {
    Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
  },
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
    const { text } = await req.json();

    const { error } = validateText({ text });
    if (error) {
      return badRequestResponse(error, null);
    }

    const modelId = "black-forest-labs/FLUX.1-dev";

    // Call HuggingFace
    const response = await hfApi.post(
      `${modelId}`,
      { inputs: text },
      { responseType: "arraybuffer" }
    );

    const uploadDir = path.join(process.cwd(), "public", "uploads", "text-to-image");

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${uuidv4()}.png`;
    const filepath = path.join(uploadDir, filename);
    const relativePath = `/uploads/text-to-image/${filename}`;

    // Save the image to disk
    fs.writeFileSync(filepath, Buffer.from(response.data));

    return successResponse("Image generated successfully", {
      imagePath: relativePath,
    });
  } catch (error) {
    console.error("Text-to-Image error:", error.response ? error.response.data : error.message);
    return serverErrorResponse("Error generating image: " + error.message);
  }
}
