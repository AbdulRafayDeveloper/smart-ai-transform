import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { successResponse, badRequestResponse, serverErrorResponse } from "../../helper/apiResponseHelpers";
import dotenv from "dotenv";

dotenv.config();

// Hugging Face API setup
const hfApi = axios.create({
    baseURL: 'https://api-inference.huggingface.co/models/',
    headers: {
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
    },
});

// Validate file helper
function validateFile(file) {
    if (!file || file.size === 0) {
        return { error: "Audio file is required and must not be empty." };
    }
    return { error: null };
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        console.log("formData: ", formData);
        const file = formData.get("audio");

        if (!file || typeof file === "string") {
            return badRequestResponse("Audio file is required.", null);
        }

        console.log("file: ", file);

        const { error } = validateFile(file);
        if (error) {
            return badRequestResponse(error, null);
        }

        console.log("error: ", error);

        // Save uploaded audio temporarily
        const uploadDir = path.join(process.cwd(), "public", "uploads", "speech-to-text");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        console.log("uploadDir: ", uploadDir);

        const filename = `${uuidv4()}.mp3`;
        const filepath = path.join(uploadDir, filename);

        console.log("filepath: ", filepath);

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filepath, fileBuffer);

        console.log("fileBuffer: ", fileBuffer);

        // Read the saved file
        const audioData = fs.readFileSync(filepath);

        const modelId = "openai/whisper-large-v3";

        console.log("modelId: ", modelId);

        // Send audio to HuggingFace
        const response = await hfApi.post(modelId, audioData, {
            headers: {
                "Content-Type": file.type || "audio/mpeg", // dynamic or fallback to audio/mpeg
            },
        });

        console.log("response: ", response);

        // Delete the temp file
        fs.unlinkSync(filepath);

        console.log("audioData: ", audioData);

        // Return transcription
        return successResponse("Transcription successful", {
            transcription: response.data.text,
        });

    } catch (error) {
        console.error("Speech-to-Text error:", error.response?.data || error.message);
        return serverErrorResponse("Error transcribing audio: " + (error.response?.data?.error || error.message));
    }
}
