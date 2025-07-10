import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateUser } from "@/app/helper/validateUser";
import { Users } from "@/app/config/Models/Users/users";
import mongoose from "mongoose";
import { db } from "@/app/config/db";
import {
  successResponse,
  badRequestResponse,
  conflictResponse,
  serverErrorResponse,
} from "@/app/helper/apiResponseHelpers";

export async function POST(req) {
  try {
    const { fullName, email, password } = await req.json();

    const { error } = validateUser({ fullName, email, password });
    if (error) {
      return badRequestResponse(error.details[0].message, null);
    }

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return conflictResponse("Account already exists with this email address", null);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      fullName,
      email,
      hashedPassword: hashedPassword,
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      return serverErrorResponse("Failed to save the user. Please try again.");
    }

    return successResponse("User registered successfully", {
      user: savedUser,
      role: savedUser.role,
    });
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}
