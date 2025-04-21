import mongoose from "mongoose";
import { NextResponse } from "next/server";
import db from "@/app/config/db";
import serverSideValidations from "@/app/helper/serverSideValidations";
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/app/helper/apiResponseHelpers";
import { Packages } from "@/app/config/Models/Packages/packages";

export async function GET(req) {
  try {
    /*const token = serverSideValidations.checkTokenValidationStyle(req);
    const user = await serverSideValidations.validateUserByToken(token);

    if (user.status) return user;*/

    const packages = await Packages.find();

    if (!packages || packages.length === 0) {
      return successResponse("No packages found", null);
    }

    return successResponse("Packages retrieved successfully", { packages });
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}
