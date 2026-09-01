import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  const timezone = searchParams.get("tz");

  if (!sessionId) {
    return NextResponse.redirect(`${origin}/auth/signin?error=session`);
  }

 
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch checkout session
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session.customer || !session.subscription) {
    return NextResponse.redirect(`${origin}/auth/signin?error=stripe`);
  }

  const stripeCustomerId = session.customer;

  // Fetch subscription
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // ⭐ Find Supabase user by Stripe customer ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", stripeCustomerId)
    .single();

  if (!profile) {
    return NextResponse.redirect(`${origin}/auth/signin?error=profile`);
  }

  // ⭐ Update membership using Supabase user ID (correct)
  await supabase
    .from("profiles")
    .update({
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: session.subscription,
      membership_status: "active",
      is_member: true,
  
      access_until: new Date(subscription.current_period_end * 1000).toISOString(),
 
      timezone: timezone || null,
    })
    .eq("id", profile.id);

  
    return NextResponse.redirect(`${origin}/sanctuary`);
}
