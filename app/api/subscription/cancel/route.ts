import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  try {
    // Supabase client (service role)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get user auth token
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Get authenticated user
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = authData.user;

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, stripe_customer_id, stripe_subscription_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (!profile.stripe_subscription_id) {
      return NextResponse.json({ error: "No active subscription to cancel" }, { status: 400 });
    }

    // ⭐ Cancel immediately — no future invoices, no prorating
    const canceled = await stripe.subscriptions.cancel(profile.stripe_subscription_id, {
      prorate: false,
      invoice_now: false,
    });

    const accessUntil = new Date(canceled.current_period_end * 1000).toISOString();

    // Update profile
    await supabase
      .from("profiles")
      .update({
        stripe_subscription_id: null,
        membership_status: "expired",
        is_member: false,
        access_until: accessUntil,
      })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      access_until: accessUntil,
    });
  } catch (err: any) {
    console.error("Cancel subscription error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
