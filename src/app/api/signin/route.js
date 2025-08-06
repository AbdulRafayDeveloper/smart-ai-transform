import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userSignIn } from "@/app/helper/userSignIn";
import { Users } from "@/app/config/Models/Users/users";
import db from "@/app/config/db";
import {
  successResponse,
  badRequestResponse,
  conflictResponse,
  serverErrorResponse,
} from "@/app/helper/apiResponseHelpers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const { error } = userSignIn({ email, password });

    if (error) {
      return badRequestResponse(error.details[0].message, null);
    }

    const existingUser = await Users.findOne({ email });

    if (!existingUser) {
      return conflictResponse("User not found", null);
    }

    console.log("Existing user found:", existingUser);

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.hashedPassword
    );

    console.log("Password validation result:", isPasswordValid);
    
    if (!isPasswordValid) {
      return badRequestResponse("Credentials do not match.", null);
    }

    console.log("User signed in successfully:", existingUser);
    console.log("User signed in successfully:", existingUser._id);
    console.log("User signed in successfully:", existingUser.email);
    console.log("User signed in successfully:", existingUser.role);

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Generated JWT token:", token);

    if (!token) {
      return serverErrorResponse("Failed to generate authentication token.");
    }

    return successResponse("User signed in successfully", { token: token, user: existingUser });
  } catch (error) {
    console.error(error);
    return serverErrorResponse("An error occurred during sign-in.", error.message);
  }
}
