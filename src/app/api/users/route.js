import { NextResponse } from "next/server";
import { Users } from "@/app/config/Models/Users/users";
import serverSideValidations from "@/app/helper/serverSideValidations";
import db from "@/app/config/db";
import {
  successResponse,
  badRequestResponse,
  conflictResponse,
  serverErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/app/helper/apiResponseHelpers";
import serverSideValidation from "@/app/helper/serverSideValidation";

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

    const users = await Users.find(filters).skip(skip).limit(size);
    const totalUsersCount = await Users.countDocuments(filters);

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
