import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { successResponse, badRequestResponse, serverErrorResponse } from "../../helper/apiResponseHelpers";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();

// Validate file helper
function validateFile(file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
        return { error: "Only JPG, JPEG, and PNG images are allowed." };
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return { error: "File size should not exceed 5MB." };
    }
    return { error: null };
}

export async function POST(req) {
    let filePath = null;

    try {
        const formData = await req.formData();
        const file = formData.get("image");

        if (!file || typeof file === "string") {
            return badRequestResponse("Image file is required.", null);
        }

        const { error } = validateFile(file);
        if (error) {
            return badRequestResponse(error, null);
        }

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), "public", "uploads", "image-to-text");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = `${uuidv4()}.jpg`;
        const filepath = path.join(uploadDir, filename);
        filePath = filepath;

        // Save the uploaded image
        const imageBuffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filepath, imageBuffer);

        // Read file and convert to base64
        const fileBuffer = fs.readFileSync(filepath);
        const base64Image = fileBuffer.toString("base64");
        const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

        // Initialize Hugging Face Inference client
        const client = new HfInference(process.env.HF_API_TOKEN);

        // Call HuggingFace API for detailed image description
        const chatCompletion = await client.chatCompletion({
            model: "Qwen/Qwen2-VL-7B-Instruct",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Please describe everything you observe in this image in detail.",
                        },
                        {
                            type: "image_url",
                            image_url: { url: imageDataUrl },
                        },
                    ],
                },
            ],
            provider: "nebius",
            max_tokens: 1000, // For longer descriptions
        });

        const description = chatCompletion?.choices?.[0]?.message?.content || null;

        if (!description) {
            return badRequestResponse("Failed to generate image description.", null);
        }

        return successResponse("Image description generated successfully", {
            description,
        });

    } catch (error) {
        console.error("Image-to-text error:", error?.response?.data || error.message);
        return serverErrorResponse("An error occurred while processing the image.");
    } finally {
        // Cleanup uploaded file
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}
