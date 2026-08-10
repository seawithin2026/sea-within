import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { email, userId } = await req.json();

  if (!email || !userId) {
    return NextResponse.json(
      { error: "Missing email or userId" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // ⭐ Find pending Stripe customer
  const { data: pending } = await supabase
    .from("stripe_customers_pending")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (!pending) {
    return NextResponse.json({ synced: false });
  }

  // ⭐ Update real profile
  await supabase
    .from("profiles")
    .update({
      stripe_customer_id: pending.stripe_customer_id,
      stripe_subscription_id: pending.stripe_subscription_id,
      is_member: true,
      membership_status: pending.membership_status,
    })
    .eq("id", userId);

  // ⭐ Remove pending entry
  await supabase
    .from("stripe_customers_pending")
    .delete()
    .eq("id", pending.id);

  return NextResponse.json({ synced: true });
}
