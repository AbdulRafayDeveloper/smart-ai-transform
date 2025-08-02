import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import s3Client from "@/app/config/s3"; // apni config ka path
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const PROJECT_NAME = process.env.PROJECT_NAME || "Smart-Transform";

export async function uploadFileToS3(buffer, folder = "uploads", extension = "png", contentType = "image/png") {
    try {
        const key = `${PROJECT_NAME}/${folder}/${uuidv4()}.${extension}`;

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            ACL: "public-read",
            ContentDisposition: "attachment",
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
        return fileUrl;
    } catch (err) {
        console.error("S3 upload error:", err);
        throw new Error("Failed to upload file to S3: " + err.message);
    }
}
