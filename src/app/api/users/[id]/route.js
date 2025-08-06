import { NextResponse } from "next/server";
import {
  successResponse,
  serverErrorResponse,
  notFoundResponse,
  badRequestResponse,
} from "@/app/helper/apiResponseHelpers";
import db from "@/app/config/db";
import { Users } from "@/app/config/Models/Users/users";
import serverSideValidation from "@/app/helper/serverSideValidation";

export async function DELETE(req) {
  try {

    const token = serverSideValidation.extractAuthToken(req);

    if (typeof token !== "string") {
      return notFoundResponse("Token not found or invalid.", null);
    }

    console.log("Token:", token);

    const user = await serverSideValidation.validateAdminByToken(token);

    console.log("User:", user);

    if (user && user.status) {
      return user;
    }

    if (!user || !user._id) {
      return notFoundResponse("User not found or invalid token.", null);
    }

    const userId = user._id;

    // Find user by userId
    const userData = await Users.findById(userId);

    console.log("User Data:", userData);

    if (!userData) {
      return notFoundResponse("User not found.", null);
    }

    const id = new URL(req.url).pathname.split("/").pop();

    const deleteUser = await Users.findByIdAndDelete(id);

    console.log("Delete User:", deleteUser);

    if (!deleteUser) {
      return notFoundResponse("User not found for deletion.", null);
    }

    return successResponse("User deleted successfully.", deleteUser);
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}
