import { NextResponse } from "next/server";
import { Users } from "@/app/config/Models/Users/users";
import serverSideValidations from "@/app/helper/serverSideValidations";
import {
  successResponse,
  badRequestResponse,
  conflictResponse,
  serverErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/app/helper/apiResponseHelpers";
import db from "@/app/config/db";
import { Subscribers } from "@/app/config/Models/Subscriber/subscribers";

export async function GET(req, res) {
  try {
    const token = serverSideValidations.checkTokenValidationStyle(req);
    const user = await serverSideValidations.validateUserByToken(token);
    if (user.status) return user;

    const id = new URL(req.url).pathname.split("/").pop();
    const foundUser = await Users.findById(id);

    if (!foundUser) {
      return notFoundResponse("User not found.", null);
    }

    return successResponse("User retrieved successfully.", foundUser);
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}

export async function PUT(req, res) {
  try {
    const token = serverSideValidations.checkTokenValidationStyle(req);
    const user = await serverSideValidations.validateUserByToken(token);
    if (user.status) return user;

    const id = new URL(req.url).pathname.split("/").pop();

    const updates = await req.json();

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { username: updates.username },
      { new: true }
    );

    if (!updatedUser) {
      return notFoundResponse("User not found for updating.", null);
    }

    return successResponse("User updated successfully.", updatedUser);
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}

export async function DELETE(req, res) {
  try {
    const token = serverSideValidations.checkTokenValidationStyle(req);
    const user = await serverSideValidations.validateUserByToken(token);
    if (user.status) return user;

    const id = new URL(req.url).pathname.split("/").pop();
    const deletedUser = await Users.findByIdAndDelete(id);
    const deleteSubscriber = await Subscribers.findOneAndDelete({ userId: id });
    if (!deletedUser || !deleteSubscriber) {
      return notFoundResponse("User not found for deletion.", null);
    }

    return successResponse("User deleted successfully.", deletedUser);
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}
