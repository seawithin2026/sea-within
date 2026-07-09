import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  // Supabase server client
  const supabase = createClient();

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Stripe client
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
  });

  // Get the Stripe customer ID from user metadata
  const stripeCustomerId = user.user_metadata.stripe_customer_id;

  if (!stripeCustomerId) {
    return NextResponse.json(
      { error: "Stripe customer ID missing" },
      { status: 400 }
    );
  }

  // Create the billing portal session
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: "https://www.seawithinyourself.com/account",
  });

  return NextResponse.json({ url: portalSession.url });
}
