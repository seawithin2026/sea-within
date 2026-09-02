export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const PRICE_IDS = {
  monthly: "price_1Tk3G1DdlqSxXxUFu0NH3PAV",
};

export async function POST(req: NextRequest) {
  try {
    const { plan, userId } = await req.json();

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json(
        { error: "Invalid or missing plan type." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],

      customer_creation: "always",

      line_items: [
        {
          price: PRICE_IDS[plan],
          quantity: 1,
        },
      ],

      client_reference_id: userId,

      metadata: {
        supabase_user_id: userId,
      },

      subscription_data: {
        metadata: {
          supabase_user_id: userId,
        },
      },

      billing_address_collection: "auto",

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/callback?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
