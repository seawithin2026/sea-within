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

  async function upsertProfile(customerId: string, data: any) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("*")
      .eq("stripe_customer_id", customerId)
      .single();

    if (existing) {
      await supabase
        .from("profiles")
        .update(data)
        .eq("stripe_customer_id", customerId);
    } else {
      await supabase.from("profiles").insert({
        stripe_customer_id: customerId,
        ...data,
      });
    }
  }

  switch (event.type) {
   case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      await upsertProfile(customerId, {
        stripe_subscription_id: sub.id,
        membership_status: "active",
        is_member: true,
       access_until: new Date(sub.current_period_end * 1000).toISOString(),
      });

      break;
    }

  case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      await upsertProfile(customerId, {
        stripe_subscription_id: sub.id,
        membership_status: sub.cancel_at_period_end ? "cancelling" : "active",
        is_member: !sub.cancel_at_period_end,
      access_until: new Date(sub.current_period_end * 1000).toISOString(),
      });

      break;
    }

   case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      await upsertProfile(customerId, {
        stripe_subscription_id: null,
        membership_status: "expired",
        is_member: false,
       access_until: new Date(sub.current_period_end * 1000).toISOString(),
      });

      break;
    }

   case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      await upsertProfile(customerId, {
        membership_status: "active",
        is_member: true,
      });

      break;
    }

  case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      await upsertProfile(customerId, {
        membership_status: "past_due",
        is_member: false,
      });

      break;
  
  }
  }

  return NextResponse.json({ received: true });
}
