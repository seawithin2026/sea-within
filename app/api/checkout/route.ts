export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const PRICE_IDS = {
  monthly: "price_1Tk3G1DdlqSxXxUFu0NH3PAV",
};

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json(
        { error: "Invalid or missing plan type." },
        { status: 400 }
      );
    }

    // ⭐ Get logged-in user using Supabase service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // ⭐ Create Stripe Checkout Session
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

      // ⭐ Attach Supabase user ID to Stripe metadata
      metadata: {
        supabase_user_id: user.id,
      },

      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },

      billing_address_collection: "auto",

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account?session_id={CHECKOUT_SESSION_ID}`,
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
