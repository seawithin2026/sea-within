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
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/sanctuary";

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Exchange magic link for session
  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !sessionData?.user) {
    return NextResponse.redirect(`${origin}/`);
  }

  const user = sessionData.user;

  // Fetch Stripe checkout session to get customer ID
  let stripeCustomerId = null;

  if (sessionId) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
      stripeCustomerId = stripeSession.customer as string;
    } catch (err) {
      console.error("Stripe session fetch error:", err);
    }
  }

  // Upsert profile WITHOUT touching membership fields
  await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      stripe_customer_id: stripeCustomerId,
    });

  // Redirect user to sanctuary — webhook will update membership
  return NextResponse.redirect(`${origin}${next}`);
}
