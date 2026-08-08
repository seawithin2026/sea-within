import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { userId, email } = await req.json();

  if (!userId || !email) {
    return NextResponse.json(
      { error: "Missing userId or email" },
      { status: 400 }
    );
  }

  // Row A: webhook-created (email-only)
  const { data: emailProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .neq("id", userId)
    .maybeSingle();

  // Row B: auth-linked (user.id)
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!emailProfile && !userProfile) {
    return NextResponse.json({ merged: false }, { status: 200 });
  }

  const merged = {
    id: userId,
    email,
    country: emailProfile?.country ?? userProfile?.country ?? null,
    stripe_customer_id:
      emailProfile?.stripe_customer_id ?? userProfile?.stripe_customer_id ?? null,
    stripe_subscription_id:
      emailProfile?.stripe_subscription_id ??
      userProfile?.stripe_subscription_id ??
      null,
    current_period_end:
      emailProfile?.current_period_end ?? userProfile?.current_period_end ?? null,
    is_member: emailProfile?.is_member ?? userProfile?.is_member ?? false,
    membership_status:
      emailProfile?.membership_status ?? userProfile?.membership_status ?? null,
    username: userProfile?.username ?? null,
  };

  await supabase.from("profiles").upsert(merged);

  if (emailProfile && emailProfile.id !== userId) {
    await supabase.from("profiles").delete().eq("id", emailProfile.id);
  }

  return NextResponse.json({ merged: true }, { status: 200 });
}
