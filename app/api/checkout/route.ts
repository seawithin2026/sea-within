export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/supabase/server";

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

    const supabase = supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // ⭐ FIXED VERSION — customer_creation REMOVED
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],

      line_items: [
        {
          price: PRICE_IDS[plan],
          quantity: 1,
        },
      ],

      metadata: {
        supabase_user_id: user.id,
      },

      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },

      billing_address_collection: "auto",

     success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("STRIPE ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
