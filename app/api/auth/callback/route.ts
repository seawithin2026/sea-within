import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";


export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
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

  // ⭐ Stripe customer ID from user metadata
  const stripeCustomerId = user.user_metadata?.stripe_customer_id ?? null;

  // ⭐ Create profile row if missing
  await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      stripe_customer_id: stripeCustomerId,
      membership_status: "none",
      is_member: false,
    });

  return NextResponse.redirect(`${origin}${next}`);
}
