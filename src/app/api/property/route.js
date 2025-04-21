import { NextResponse } from "next/server";
import { Properties } from "@/app/config/Models/Property/property";
import { Subscribers } from "@/app/config/Models/Subscriber/subscribers";
import { Packages } from "@/app/config/Models/Packages/packages";
import serverSideValidations from "@/app/helper/serverSideValidations";

import db from "@/app/config/db";
import {
  successResponse,
  serverErrorResponse,
  notFoundResponse,
  conflictResponse,
} from "@/app/helper/apiResponseHelpers";

import serverSideHomeOwnerValidation from "@/app/helper/serverSideHomeOwnerValidation";

export async function GET(req) {
  try {
    const token = serverSideHomeOwnerValidation.extractAuthToken(req);
    if (typeof token !== "string") return token;

    const homeowner =
      await serverSideHomeOwnerValidation.validateHomeownerByToken(token);
    if (homeowner.status) return homeowner;

    console.log(homeowner);
    const {
      search = "",
      pageNumber = 1,
      pageSize = 5,
    } = Object.fromEntries(req.nextUrl.searchParams);

    const page = parseInt(pageNumber, 10);
    const size = parseInt(pageSize, 10);
    const skip = (page - 1) * size;

    const filters = search
      ? { name: { $regex: search, $options: "i" }, subscriberId: homeowner._id }
      : { subscriberId: homeowner._id };

    const properties = await Properties.find(filters).skip(skip).limit(size);
    console.log(properties);
    const totalPropertiesCount = await Properties.countDocuments(filters);

    if (!properties || properties.length === 0) {
      return notFoundResponse("No properties found.");
    }

    return successResponse("Properties retrieved successfully.", {
      user: {
        id: homeowner._id,
        firstName: homeowner.username,
        email: homeowner.email,
        profileImage: homeowner.profileImage,
      },
      properties,
      totalPropertiesCount,
      pageNumber: page,
      pageSize: size,
    });
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}

export async function POST(req) {
  try {
    const token = serverSideHomeOwnerValidation.extractAuthToken(req);
    if (typeof token !== "string") return token;

    const homeowner =
      await serverSideHomeOwnerValidation.validateHomeownerByToken(token);
    if (homeowner.status) return homeowner;

    const subscriberId = homeowner.id;

    const subscriber = await Subscribers.findOne({ userId: subscriberId });
    if (!subscriber) {
      return notFoundResponse("Subscriber record not found.");
    }

    const packageDetails = await Packages.findById(subscriber.packageId);
    if (!packageDetails) {
      return notFoundResponse("Package details not found.");
    }

    const allowedProperties = packageDetails.property_included;
    const currentPropertyCount = subscriber.totalproperty || 0;

    if (currentPropertyCount >= allowedProperties) {
      return conflictResponse(
        `Property limit exceeded. Allowed: ${allowedProperties}, Current: ${currentPropertyCount}`
      );
    }

    const {
      color,
      name,
      address,
      purchaseDate,
      propertyPrice,
      yearBuilt,
      interestRate,
      squareFeet,
      image,
    } = await req.json();

    const newProperty = new Properties({
      color,
      name,
      address,
      purchaseDate,
      propertyPrice,
      yearBuilt,
      interestRate,
      squareFeet,
      image,
      subscriberId,
    });

    const savedProperty = await newProperty.save();
    if (!savedProperty) {
      return serverErrorResponse("Failed to save the property.");
    }
    await Subscribers.findOneAndUpdate(
      { userId: subscriberId },
      { $inc: { totalproperty: 1 } },
      { new: true }
    );

    return successResponse(
      "Property added successfully and subscriber total property updated.",
      {
        property: savedProperty,
      }
    );
  } catch (error) {
    return serverErrorResponse(error.message);
  }
}
