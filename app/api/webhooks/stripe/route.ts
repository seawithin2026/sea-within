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

  async function updateProfile(email: string, data: any) {
    await supabase
      .from("profiles")
      .update(data)
      .eq("email", email);
  }



  switch (event.type) {
    // -------------------------------------------------
    // ⭐ Subscription Created
    // -------------------------------------------------
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;

      const customer = (await stripe.customers.retrieve(
        sub.customer as string
      )) as Stripe.Customer;

      const email = customer.email ?? null;

      await updateProfile(email!, {
        stripe_customer_id: sub.customer,
        stripe_subscription_id: sub.id,
        membership_status: "active",
        is_member: true,
        access_until: new Date(sub.current_period_end * 1000).toISOString(),
      });

      break;
    }

    // -------------------------------------------------
    // ⭐ Subscription Updated
    // -------------------------------------------------
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;

      const customer = (await stripe.customers.retrieve(
        sub.customer as string
      )) as Stripe.Customer;

      const email = customer.email ?? null;

      await updateProfile(email!, {
        stripe_customer_id: sub.customer,
        stripe_subscription_id: sub.id,
        membership_status: sub.cancel_at_period_end ? "cancelling" : "active",
        is_member: !sub.cancel_at_period_end,
        access_until: new Date(sub.current_period_end * 1000).toISOString(),
      });

      break;
    }

    // -------------------------------------------------
    // ⭐ Subscription Deleted (Immediate cancellation)
    // -------------------------------------------------
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;

      const customer = (await stripe.customers.retrieve(
        sub.customer as string
      )) as Stripe.Customer;

      const email = customer.email ?? null;

      await updateProfile(email!, {
        stripe_customer_id: sub.customer,
        stripe_subscription_id: null,
        membership_status: "expired",
        is_member: false,
        access_until: new Date(sub.current_period_end * 1000).toISOString(),
      });

      break;
    }

    // -------------------------------------------------
    // ⭐ Invoice Paid
    // -------------------------------------------------
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;

      await updateProfile(invoice.customer_email!, {
        membership_status: "active",
        is_member: true,
      });

      break;
    }

    // -------------------------------------------------
    // ⭐ Invoice Failed
    // -------------------------------------------------
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;

      await updateProfile(invoice.customer_email!, {
        membership_status: "past_due",
        is_member: false,
      });

      break;
    }


    default:
      break;
  }

  return NextResponse.json({ received: true });
}
