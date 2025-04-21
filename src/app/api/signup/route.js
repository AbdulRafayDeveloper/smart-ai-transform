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

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { username, email, password, role } = await req.json();

    const { error } = validateUser({ username, email, password, role });
    if (error) {
      return badRequestResponse(error.details[0].message, null);
    }

    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return conflictResponse("Email already exists", null);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      username,
      email,
      role,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      return serverErrorResponse("Failed to save the user. Please try again.");
    }

    const token = jwt.sign(
      { id: newUser._id, name: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    if (!token) {
      console.error("Failed to generate JWT token.");
      return serverErrorResponse("Failed to generate authentication token.");
    }

    return successResponse("User registered successfully", {
      token: token,
      user: newUser,
      role,
    });
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}
