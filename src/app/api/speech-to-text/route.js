// // src/app/api/speech-to-text/route.js

// import { writeFile } from "fs/promises";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { successResponse, badRequestResponse, serverErrorResponse } from "@/app/helper/apiResponseHelpers";

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const voiceFile = formData.get("voice");

//     if (!voiceFile || typeof voiceFile === "string") {
//       return badRequestResponse("Voice file is required.", null);
//     }

//     const ext = path.extname(voiceFile.name || "").toLowerCase();
//     const allowedExtensions = [".mp3", ".wav", ".ogg", ".webm", ".m4a"];
//     if (!allowedExtensions.includes(ext)) {
//       return badRequestResponse("Invalid file format. Only audio files are allowed.", null);
//     }

//     // Create uploads dir
//     const uploadDir = path.join(process.cwd(), "public", "uploads", "speech-to-text");
//     const filename = `${uuidv4()}${ext}`;
//     const filepath = path.join(uploadDir, filename);

//     // Ensure directory exists
//     await import("fs").then(fs => {
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }
//     });

//     // Read stream and write to file
//     const arrayBuffer = await voiceFile.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     await writeFile(filepath, buffer);

//     return successResponse("Voice file uploaded successfully", {
//       savedPath: `/uploads/speech-to-text/${filename}`,
//     });

//   } catch (error) {
//     console.error("Upload error:", error);
//     return serverErrorResponse("Error uploading audio: " + error.message);
//   }
// }
