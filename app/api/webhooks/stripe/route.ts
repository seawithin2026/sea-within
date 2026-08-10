import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";


export const dynamic = "force-dynamic";
export const runtime = "nodejs";






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

  // ⭐ Store pending Stripe customer
  async function storePending(data: any) {
    await supabase.from("stripe_customers_pending").upsert(data);
  }



  switch (event.type) {
    // -------------------------------------------------
    // ⭐ Subscription Created
    // -------------------------------------------------
    case "customer.subscription.created": {
      const sub = event.data.object;
      const customerId = sub.customer as string;

      await storePending({
        email: sub.customer_email,
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        membership_status: "active",
      });

      break;
    }

    // -------------------------------------------------
    // ⭐ Subscription Updated
    // -------------------------------------------------
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const customerId = sub.customer as string;

      await storePending({
        email: sub.customer_email,
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        membership_status: sub.cancel_at_period_end ? "cancelling" : "active",
      });

      break;
    }

    // -------------------------------------------------
    // ⭐ Subscription Deleted
    // -------------------------------------------------
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const customerId = sub.customer as string;

      await storePending({
        email: sub.customer_email,
        stripe_customer_id: customerId,
        stripe_subscription_id: null,
        membership_status: "expired",
    
      });

      break;
    }

    // -------------------------------------------------
    // ⭐ Invoice Paid
    // -------------------------------------------------
    case "invoice.paid": {
      const invoice = event.data.object;

      await storePending({
        email: invoice.customer_email,
        stripe_customer_id: invoice.customer,
        membership_status: "active",
      });

      break;
    }

    // -------------------------------------------------
    // ⭐ Invoice Failed
    // -------------------------------------------------
    case "invoice.payment_failed": {
      const invoice = event.data.object;

      await storePending({
        email: invoice.customer_email,
        stripe_customer_id: invoice.customer,
        membership_status: "past_due",
      });

      break;
    }

    

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
