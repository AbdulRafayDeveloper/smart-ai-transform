import { NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/app/config/db";
import { Packages } from "@/app/config/Models/Packages/packages";
import { Subscribers } from "@/app/config/Models/Subscriber/subscribers";
import serverSideHomeOwnerValidation from "@/app/helper/serverSideHomeOwnerValidation";
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
} from "@/app/helper/apiResponseHelpers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    console.log("1");
    const token = serverSideHomeOwnerValidation.extractAuthToken(req);
    if (typeof token !== "string") return token;

    const homeowner =
      await serverSideHomeOwnerValidation.validateHomeownerByToken(token);
    if (homeowner.status) return homeowner;

    const userId = homeowner.id;

    const {
      paymentMethodId,
      country,
      postalCode,
      packageId,
      isGifted = false,
      fullName = "No Name Provided",
    } = await req.json();

    console.log(
      "Received:",
      paymentMethodId,
      country,
      postalCode,
      packageId,
      isGifted
    );

    if (
      !packageId ||
      (!isGifted && (!paymentMethodId || !country || !postalCode))
    ) {
      return badRequestResponse("Missing required fields.");
    }

    const selectedPackage = await Packages.findById(packageId);
    if (!selectedPackage || !selectedPackage.price) {
      return notFoundResponse("Invalid package or missing price.");
    }

    const totalproperty = 0;
    const amountInCents = Math.round(selectedPackage.price * 100);
    let paymentIntent = null;

    if (!isGifted) {
      try {
        paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: "usd",
          payment_method: paymentMethodId,
          confirm: true,
          return_url: `http://localhost:3000/payment-success`,
          shipping: {
            name: fullName,
            address: {
              country,
              postal_code: postalCode,
            },
          },
        });

        console.log("Stripe PaymentIntent Status:", paymentIntent.status);
      } catch (stripeError) {
        console.error("Stripe Payment Error:", stripeError);

        return NextResponse.json(
          {
            success: false,
            error: stripeError.message || "Stripe payment failed.",
            stripeCode: stripeError.code || null,
            decline_code: stripeError.raw?.decline_code || null,
            param: stripeError.param || null,
            type: stripeError.type || null,
          },
          { status: 402 }
        );
      }

      const validStatuses = [
        "succeeded",
        "requires_capture",
        "requires_action",
      ];
      if (!validStatuses.includes(paymentIntent.status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Payment failed or is in unexpected state: '${paymentIntent.status}'.`,
            status: paymentIntent.status,
          },
          { status: 400 }
        );
      }
    }

    const newSubscriber = new Subscribers({
      userId,
      packageId,
      totalproperty,
      isGifted,
    });

    const savedSubscriber = await newSubscriber.save();
    if (!savedSubscriber) {
      return serverErrorResponse("Subscriber save failed after payment.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Subscription created successfully",
        subscriber: savedSubscriber,
        paymentIntent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing subscription:", error);
    return serverErrorResponse(error.message);
  }
}
