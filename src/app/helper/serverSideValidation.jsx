import jwt from "jsonwebtoken";
import { Users } from "@/app/config/Models/Users/users";
import {
  badRequestResponse,
  conflictResponse,
  serverErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/app/helper/apiResponseHelpers";
import connectDB from "@/app/config/db";

const JWT_SECRET = process.env.JWT_SECRET;

const serverSideValidation = {
  extractAuthToken: function (req) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return badRequestResponse(
        "You're not logged in. Please sign in to continue.",
        null
      );
    }

    const parts = authHeader.split(" ");

    if (parts.length === 2 && parts[0] === "Bearer") {
      return parts[1];
    } else if (parts.length === 1) {
      return parts[0];
    } else {
      return badRequestResponse(
        "Your session is invalid. Please log in again.",
        null
      );
    }
  },

  validateUserByToken: async function (token) {
    try {
      if (!token) {
        console.log("validateUserByToken: Token is missing");
        return badRequestResponse(
          "You're not logged in. Please sign in to continue.",
          null
        );
      }

      const tokenData = this.verify(token);

      console.log("validateUserByToken: Token data", tokenData);

      if (tokenData.status && tokenData.status !== 200) {
        console.log("validateUserByToken: Token verification failed", tokenData);
        return tokenData;
      }

      const user = await Users.findOne({ _id: tokenData.id });

      console.log("validateUserByToken: User found", user);

      if (!user) {
        console.log("validateUserByToken: User not found");
        return notFoundResponse("User not found, log in again", null);
      }

      if (user.role !== "user") {
        console.log("validateUserByToken: Access denied for non-user roles");
        return badRequestResponse(
          "Access Denied. Only users can perform this action.",
          null
        );
      }

      console.log("validateUserByToken: User found", user);
      return user;
    }
    catch (err) {
      console.error("validateUserByToken: Error occurred", err);
      return serverErrorResponse("An unexpected error occurred", null);
    }
  },

  validateAdminByToken: async function (token) {
    try {
      if (!token) {
        console.log("validateUserByToken: Token is missing");
        return badRequestResponse(
          "You're not logged in. Please sign in to continue.",
          null
        );
      }

      const tokenData = this.verify(token);

      console.log("validateUserByToken: Token data", tokenData);

      if (tokenData.status && tokenData.status !== 200) {
        console.log("validateUserByToken: Token verification failed", tokenData);
        return tokenData;
      }

      const user = await Users.findOne({ _id: tokenData.id });

      console.log("validateUserByToken: User found", user);

      if (!user) {
        console.log("validateUserByToken: User not found");
        return notFoundResponse("User not found, log in again", null);
      }

      if (user.role !== "admin") {
        console.log("validateUserByToken: Access denied for user roles.");
        return badRequestResponse(
          "Users Denied. Only admin can perform this action.",
          null
        );
      }

      console.log("validateUserByToken: Admin found", user);
      return user;
    }
    catch (err) {
      console.error("validateAdminByToken: Error occurred", err);
      return serverErrorResponse("An unexpected error occurred", null);
    }
  },

  verify: function (token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return conflictResponse(
          "Your session has expired. Please log in again.",
          null
        );
      } else if (err.name === "JsonWebTokenError") {
        return conflictResponse(
          "Your session has expired. Please log in again.",
          null
        );
      } else {
        return notFoundResponse(
          "There was an issue with your session. Please log in again.",
          null
        );
      }
    }
  },
};

export default serverSideValidation;
