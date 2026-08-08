import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
 
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }


  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Helper: update profile safely
  async function updateProfile(userId: string, fields: any) {
    await supabase.from("profiles").update(fields).eq("id", userId);
  }

  // Helper: find profile by Stripe customer ID
  async function findProfileByCustomer(customerId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    return data;
  }

  // ---------------------------
  // ⭐ HANDLE EVENTS
  // ---------------------------

  switch (event.type) {
    // ---------------------------
    // ⭐ Subscription Created
    // ---------------------------
    case "customer.subscription.created": {
      const sub = event.data.object;
      const customerId = sub.customer as string;

      const profile = await findProfileByCustomer(customerId);
      if (!profile) break;

      await updateProfile(profile.id, {
        is_member: true,
        membership_status: "active",
        stripe_subscription_id: sub.id,
      });

      break;
    }

    // ---------------------------
    // ⭐ Subscription Updated
    // (includes cancel_at_period_end)
    // ---------------------------
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const customerId = sub.customer as string;

      const profile = await findProfileByCustomer(customerId);
      if (!profile) break;

      if (sub.cancel_at_period_end) {
        // User clicked "Cancel" in Stripe portal
        await updateProfile(profile.id, {
          is_member: true, // still active until period ends
          membership_status: "cancelling",
        });
      } else {
        // Normal update (renewal, plan change)
        await updateProfile(profile.id, {
          is_member: true,
          membership_status: "active",
        });
      }

      break;
    }

    // ---------------------------
    // ⭐ Subscription Deleted
    // (billing period ended)
    // ---------------------------
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const customerId = sub.customer as string;

      const profile = await findProfileByCustomer(customerId);
      if (!profile) break;

      // Access removed ONLY when Stripe ends the subscription
      await updateProfile(profile.id, {
        is_member: false,
        membership_status: "expired",
        stripe_subscription_id: null,
      });

      break;
    }

    // ---------------------------
    // ⭐ Invoice Paid
    // ---------------------------
    case "invoice.paid": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      const profile = await findProfileByCustomer(customerId);
      if (!profile) break;

      await updateProfile(profile.id, {
        is_member: true,
        membership_status: "active",
      });

      break;
    }

    // ---------------------------
    // ⭐ Invoice Payment Failed
    // ---------------------------
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      const profile = await findProfileByCustomer(customerId);
      if (!profile) break;

      await updateProfile(profile.id, {
        membership_status: "past_due",
      });

      break;
    }

    // ---------------------------
    // ⭐ Customer Created
    // ---------------------------
    case "customer.created": {
      const customer = event.data.object;

      // You may store customer.id if needed
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
