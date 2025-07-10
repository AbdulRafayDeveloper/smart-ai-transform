import {
    successResponse,
    badRequestResponse,
    serverErrorResponse,
    notFoundResponse,
} from "../../helper/apiResponseHelpers";
import { NextResponse } from "next/server";
import { Users } from "@/app/config/Models/Users/users";
import { ImageToTextUsers } from "@/app/config/Models/ImageToTextUsers/ImageToTextUsers";
import { SpeechToTextUsers } from "@/app/config/Models/SpeechToTextUsers/SpeechToTextUsers";
import { TextToImageUsers } from "@/app/config/Models/TextToImageUsers/TextToImageUsers";
import { TextToSpeechUsers } from "@/app/config/Models/TextToSpeechUsers/TextToSpeechUsers";
import { TextToVideoUsers } from "@/app/config/Models/TextToVideoUsers/TextToVideoUsers";

export async function GET(req, res) {
    try {
        const totalUsers = await Users.countDocuments({ role: "user" });
        const totalImageToTextUsers = await ImageToTextUsers.countDocuments();
        const totalSpeechToTextUsers = await SpeechToTextUsers.countDocuments();
        const totalTextToImageUsers = await TextToImageUsers.countDocuments();
        const totalTextToSpeechUsers = await TextToSpeechUsers.countDocuments();
        const totalTextToVideoUsers = await TextToVideoUsers.countDocuments();

        const stats = {
            totalUsers,
            totalImageToTextUsers,
            totalSpeechToTextUsers,
            totalTextToImageUsers,
            totalTextToSpeechUsers,
            totalTextToVideoUsers
        };

        console.log("Dashboard stats:", stats);

        return successResponse("Dashboard data fetched successfully.", stats);
    } catch (error) {
        console.error("Error:", error);
        return serverErrorResponse("An error occurred while fetching the dashboard data.");
    }
}
