import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }


  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  // ============================================
  // CHECKOUT COMPLETED → MARK MEMBER
  // ============================================
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email;
    const countryCode = session.customer_details?.address?.country || "Unknown";
    const country = regionNames.of(countryCode) || countryCode;

    if (email) {
      await supabase
        .from("profiles")
        .update({
          country,
          is_member: true,
          membership_status: "active",
          stripe_customer_id: session.customer,
        })
        .eq("email", email); // ⭐ FIXED: match by email
    }
  }

  // ============================================
  // SUBSCRIPTION CREATED → STORE SUBSCRIPTION ID
  // ============================================
  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;

    await supabase
      .from("profiles")
      .update({
        stripe_subscription_id: subscription.id,
        current_period_end: new Date(subscription.current_period_end * 1000),
        membership_status: subscription.status,
        is_member: true,
      })
      .eq("stripe_customer_id", subscription.customer as string);
  }

  // ============================================
  // RENEWAL → KEEP USER ACTIVE
  // ============================================
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;

    const customerId = invoice.customer as string;

    await supabase
      .from("profiles")
      .update({
        is_member: true,
        membership_status: "active",
      })
      .eq("stripe_customer_id", customerId);
  }

  // ============================================
  // USER CLICKED "CANCEL" → KEEP ACCESS UNTIL END
  // ============================================
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    if (subscription.cancel_at_period_end) {
      await supabase
        .from("profiles")
        .update({
          membership_status: "cancel_at_period_end",
          current_period_end: new Date(subscription.current_period_end * 1000),
        })
        .eq("stripe_customer_id", subscription.customer as string);
    } else if (subscription.status === "active") {
    
      await supabase
        .from("profiles")
        .update({
          is_member: true,
          membership_status: "active",
          current_period_end: new Date(subscription.current_period_end * 1000),
        })
        .eq("stripe_customer_id", subscription.customer as string);
    }
  }

  // ============================================
  // SUBSCRIPTION ENDED → REMOVE ACCESS
  // ============================================
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await supabase
      .from("profiles")
      .update({
        is_member: false,
        membership_status: "canceled",
      
      })
      .eq("stripe_customer_id", subscription.customer as string);
  }

  return new NextResponse("OK", { status: 200 });
}
