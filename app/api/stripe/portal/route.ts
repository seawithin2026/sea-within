import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  // Supabase server client (reads user from cookies)
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

  // Stripe client with API version (required)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});


  // Fetch Stripe customer ID from your profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "Stripe customer ID missing" },
      { status: 400 }
    );
  }

  // Create the billing portal session
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: "https://www.seawithinyourself.com/account",
  });

  // Return JSON so your frontend can redirect
  return NextResponse.json({ url: portalSession.url });
}
