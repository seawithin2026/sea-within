import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const sessionId = searchParams.get("session_id"); // ⭐ from Stripe success_url
  const next = searchParams.get("next") ?? "/sanctuary";

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const supabase = supabaseServer();
  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/`);
  }

  const user = sessionData?.user;

  if (!user) {
    return NextResponse.redirect(`${origin}/`);
  }

  // ⭐ Fetch Stripe checkout session to get customer ID
  let stripeCustomerId = user.user_metadata?.stripe_customer_id ?? null;

  if (!stripeCustomerId && sessionId) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
      stripeCustomerId = stripeSession.customer as string;
    } catch (err) {
      console.error("Stripe session fetch error:", err);
    }
  }

  // ⭐ Create or update profile WITHOUT touching membership fields
  await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      stripe_customer_id: stripeCustomerId,
    });

  return NextResponse.redirect(`${origin}${next}`);
}
