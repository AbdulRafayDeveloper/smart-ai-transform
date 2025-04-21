import { NextResponse } from "next/server";
import { Properties } from "@/app/config/Models/Property/property";
import { Subscribers } from "@/app/config/Models/Subscriber/subscribers";

import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
  badRequestResponse,
} from "@/app/helper/apiResponseHelpers";
import serverSideHomeOwnerValidation from "@/app/helper/serverSideHomeOwnerValidation";

export async function GET(req) {
  try {
    const token = serverSideHomeOwnerValidation.extractAuthToken(req);
    if (typeof token !== "string") return token;

    const homeowner =
      await serverSideHomeOwnerValidation.validateHomeownerByToken(token);
    if (homeowner.status) return homeowner;

    const id = new URL(req.url).pathname.split("/").pop();

    const property = await Properties.findOne({
      _id: id,
      subscriberId: homeowner.id,
    });

    if (!property) {
      return notFoundResponse("Property not found or access denied.");
    }

    return successResponse("Property retrieved successfully.", property);
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}

export async function PUT(req) {
  try {
    const token = serverSideHomeOwnerValidation.extractAuthToken(req);
    if (typeof token !== "string") return token;

    const homeowner =
      await serverSideHomeOwnerValidation.validateHomeownerByToken(token);
    if (homeowner.status) return homeowner;

    const id = new URL(req.url).pathname.split("/").pop();
    const updates = await req.json();

    const allowedFields = [
      "color",
      "name",
      "address",
      "purchaseDate",
      "propertyPrice",
      "yearBuilt",
      "interestRate",
      "squareFeet",
      "image",
    ];

    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    if (Object.keys(filteredUpdates).length === 0) {
      return badRequestResponse("No valid fields provided for update.");
    }

    const property = await Properties.findOne({
      _id: id,
      subscriberId: homeowner.id,
    });
    if (!property) {
      return notFoundResponse("Property not found or access denied.");
    }

    const updatedProperty = await Properties.findByIdAndUpdate(
      id,
      filteredUpdates,
      { new: true }
    );

    if (!updatedProperty) {
      return serverErrorResponse("Failed to update property.");
    }

    return successResponse("Property updated successfully.", updatedProperty);
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}

export async function DELETE(req) {
  try {
    const token = serverSideHomeOwnerValidation.extractAuthToken(req);
    if (typeof token !== "string") return token;

    const homeowner =
      await serverSideHomeOwnerValidation.validateHomeownerByToken(token);
    if (homeowner.status) return homeowner;

    const id = new URL(req.url).pathname.split("/").pop();

    const property = await Properties.findOne({
      _id: id,
      subscriberId: homeowner.id,
    });
    if (!property) {
      return notFoundResponse("Property not found or access denied.");
    }

    await Properties.findByIdAndDelete(id);

    await Subscribers.findOneAndUpdate(
      { userId: homeowner.id },
      { $inc: { totalproperty: -1 } },
      { new: true }
    );

    return successResponse("Property deleted successfully.");
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}
