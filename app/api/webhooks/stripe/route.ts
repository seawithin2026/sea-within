import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

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

  // Initialize Supabase admin client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // ⭐ Automatic full country name resolver
  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

  // ⭐ CHECKOUT COMPLETED → CREATE USER + SAVE COUNTRY + MARK MEMBER
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout completed:", session);

    const email = session.customer_details?.email;
    const countryCode = session.customer_details?.address?.country || "Unknown";
    const country = regionNames.of(countryCode) || countryCode;

    if (email) {
      // 1. Check if user already exists
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      let userId = existingUser?.id;

      // 2. Create user only if not existing
      if (!userId) {
        const { data: userData, error: userError } =
          await supabase.auth.admin.createUser({
            email,
            email_confirm: true,
            password: crypto.randomUUID(),
          });

        if (userError) {
          console.error("Supabase user creation error:", userError);
        }

        userId = userData?.user?.id;
      }

      // 3. Update profile (country + membership)
      if (userId) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            country,
            is_member: true,
          })
          .eq("id", userId);

        if (profileError) {
          console.error("Error updating profile:", profileError);
        }
      }
    }
  }

  // ⭐ RENEWALS → KEEP USER AS MEMBER
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    const email = invoice.customer_email;

    if (email) {
      await supabase
        .from("profiles")
        .update({ is_member: true })
        .eq("email", email);
    }
  }

  // ⭐ SUBSCRIPTION CANCELLED → REMOVE MEMBERSHIP
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const email = subscription.customer_email;

    if (email) {
      await supabase
        .from("profiles")
        .update({ is_member: false })
        .eq("email", email);
    }
  }

  return new NextResponse("OK", { status: 200 });
}
