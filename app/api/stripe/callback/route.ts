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
  const timezone = searchParams.get("tz"); // ⭐ user's timezone passed from frontend

  if (!sessionId) {
    return NextResponse.redirect(`${origin}/auth/signin?error=session`);
  }

  // Supabase client (service role)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch checkout session
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session.customer || !session.subscription) {
    return NextResponse.redirect(`${origin}/auth/signin?error=stripe`);
  }

  // Fetch subscription
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // Fetch customer
  const customer = (await stripe.customers.retrieve(
    session.customer as string
  )) as Stripe.Customer;

  const email = customer.email;

  if (!email) {
    return NextResponse.redirect(`${origin}/auth/signin?error=email`);
  }

  // ⭐ Store Stripe data + user's timezone (if provided)
  await supabase
    .from("profiles")
    .update({
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      membership_status: "active",
      is_member: true,

      // ⭐ Store Stripe's UTC timestamp (correct)
      access_until: new Date(subscription.current_period_end * 1000).toISOString(),

      // ⭐ Store user's timezone (if frontend passed it)
      timezone: timezone || null,
    })
    .eq("email", email);

  // Redirect user to sanctuary
  return NextResponse.redirect(`${origin}/sanctuary`);
}
