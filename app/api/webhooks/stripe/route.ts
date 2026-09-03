import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

// ⭐ Helper: Read raw body from App Router request
async function getRawBody(req: NextRequest): Promise<Buffer> {
  const chunks = [];
  const reader = req.body!.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  let event;

  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers.get("stripe-signature")!;

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  async function upsertProfile(customerId: string, data: any) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("*")
      .eq("stripe_customer_id", customerId)
      .single();

    if (existing) {
      await supabase.from("profiles").update(data).eq("stripe_customer_id", customerId);
    } else {
      await supabase.from("profiles").insert({
        stripe_customer_id: customerId,
        ...data,
      });
    }
  }

  async function getCustomerData(customerId: string) {
    const raw = await stripe.customers.retrieve(customerId);
    const customer = raw as Stripe.Customer;

    if ((customer as any).deleted) {
      return { email: null, country: null };
    }

    return {
      email: customer.email ?? null,
      country: customer.address?.country ?? null,
    };
  }

  // ⭐ Handle events
  switch (event.type) {
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const { email, country } = await getCustomerData(customerId);

      await upsertProfile(customerId, {
        email,
        country,
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
      const { email, country } = await getCustomerData(customerId);

      await upsertProfile(customerId, {
        email,
        country,
        stripe_subscription_id: sub.id,
        membership_status: sub.cancel_at_period_end ? "cancelling" : "active",
        is_member: true,
        access_until: new Date(sub.current_period_end * 1000).toISOString(),
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const { email, country } = await getCustomerData(customerId);

      await upsertProfile(customerId, {
        email,
        country,
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
      const { email, country } = await getCustomerData(customerId);

      await upsertProfile(customerId, {
        email,
        country,
        membership_status: "active",
        is_member: true,
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const { email, country } = await getCustomerData(customerId);

      await upsertProfile(customerId, {
        email,
        country,
        membership_status: "past_due",
        is_member: false,
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
