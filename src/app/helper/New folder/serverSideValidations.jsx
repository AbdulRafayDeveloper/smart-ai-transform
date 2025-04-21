import jwt from "jsonwebtoken";
import { Users } from "@/app/config/Models/Users/users";
import {
  badRequestResponse,
  conflictResponse,
  serverErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/app/helper/apiResponseHelpers";

const JWT_SECRET = process.env.JWT_SECRET;

const serverSideValidations = {
  checkTokenValidationStyle: function (req) {
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
      if (!token)
        return badRequestResponse(
          "You're not logged in. Please sign in to continue.",
          null
        );

      const tokenData = this.verify(token);

      if (tokenData?.status) return tokenData;

      const user = await Users.findOne({ _id: tokenData.id });
      if (!user) return notFoundResponse("User not found, log in again", null);

      if (user.role !== "admin") {
        return conflictResponse(
          "Access Denied. Provide admin credentials",
          null
        );
      }

      return user;
    } catch (err) {
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

export default serverSideValidations;
