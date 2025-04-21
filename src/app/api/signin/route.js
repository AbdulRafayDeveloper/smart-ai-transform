import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userSignIn } from "@/app/helper/userSignIn";
import { Users } from "@/app/config/Models/Users/users";
import { Properties } from "@/app/config/Models/Property/property";
import db from "@/app/config/db";
import {
  successResponse,
  badRequestResponse,
  conflictResponse,
  serverErrorResponse,
} from "@/app/helper/apiResponseHelpers";
import { Subscribers } from "@/app/config/Models/Subscriber/subscribers";

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

    if (existingUser.role === "admin") {
      return badRequestResponse(
        "Admins are not allowed to sign in from this portal",
        null
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return badRequestResponse("Invalid password", null);
    }
    const subscriber = await Subscribers.findOne({ userId: existingUser._id });
    const is_subscriber = !!subscriber;

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
        is_subscriber: is_subscriber,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    if (!token) {
      return serverErrorResponse("Failed to generate authentication token.");
    }

    if (!subscriber) {
      return successResponse("User signed in successfully", {
        token,
        is_subscriber: false,
        redirectTo: "/auth/add_packages",
      });
    }

    const totalProperties = subscriber.totalproperty || 0;

    if (totalProperties === 0) {
      return successResponse("User signed in successfully", {
        token,
        is_subscriber: true,
        redirectTo: "/auth/property/add_property",
      });
    }

    const properties = await Properties.find({
      subscriberId: existingUser._id,
    });
    const firstproperty = properties[0];
    return successResponse("User signed in successfully", {
      token,
      is_subscriber: true,
      redirectTo: "/owner/dashboard",
      defaultPropertyId: firstproperty._id,
    });
  } catch (error) {
    console.error(error);
    return serverErrorResponse("Sign in failed, please try again later!");
  }
}
