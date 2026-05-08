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
    process.env.SUPABASE_SERVICE_ROLE_KEY! // service role required for admin actions
  );

  // ⭐ COUNTRY MAP (convert CA → Canada, etc.)
  const countryMap: Record<string, string> = {
    CA: "Canada",
    US: "United States",
    FR: "France",
    GB: "United Kingdom",
    AU: "Australia",
    JP: "Japan",
    BR: "Brazil",
    MX: "Mexico",
    DE: "Germany",
    IT: "Italy",
    ES: "Spain",
    // Add more if needed
  };

  // ⭐ CHECKOUT COMPLETED → CREATE USER + SAVE COUNTRY
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout completed:", session);

    const email = session.customer_details?.email;
    const countryCode = session.customer_details?.address?.country || "Unknown";
    const country = countryMap[countryCode] || countryCode;

    if (email) {
      // 1. Create Supabase user
      const { data: userData, error: userError } =
        await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          password: crypto.randomUUID(), // random password
        });

      if (userError) {
        console.error("Supabase user creation error:", userError);
      }

      const userId = userData?.user?.id;

      if (userId) {
        // 2. Save country to profiles table
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ country })
          .eq("id", userId);

        if (profileError) {
          console.error("Error saving country:", profileError);
        }
      }
    }
  }

  // ⭐ SUBSCRIPTION CANCELLED (you already had this)
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    console.log("Subscription cancelled:", subscription);
  }

  return new NextResponse("OK", { status: 200 });
}
