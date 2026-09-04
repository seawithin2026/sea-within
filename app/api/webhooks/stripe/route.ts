import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

// Correct raw body reader for App Router + Vercel/serverless
async function getRawBody(req: Request): Promise<Buffer> {
  const arrayBuffer = await req.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: Request) {
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
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch customer data (email, country, full_name)
  async function getCustomerData(customerId: string) {
    const raw = await stripe.customers.retrieve(customerId);
    const customer = raw as Stripe.Customer;

    if ((customer as any).deleted) {
      return { email: null, country: null, full_name: null };
    }

    return {
      email: customer.email ?? null,
      country: customer.address?.country ?? null,
      full_name: customer.name ?? null,
    };
  }

  // Safe date helper
  function safeDate(ts: number | null | undefined) {
    return ts ? new Date(ts * 1000).toISOString() : null;
  }

  // Upsert profile safely
  async function upsertProfile(customerId: string, data: any) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("*")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();

    const payload = {
      stripe_customer_id: customerId,

      // Only send fields Stripe actually provides
      email: data.email ?? existing?.email ?? null,
      country: data.country ?? existing?.country ?? null,
      full_name: data.full_name ?? existing?.full_name ?? null,

      // Subscription fields
      stripe_subscription_id:
        data.stripe_subscription_id ?? existing?.stripe_subscription_id ?? null,

      access_until: data.access_until ?? existing?.access_until ?? null,

      // Membership logic
      membership_status: data.membership_status ?? existing?.membership_status ?? "inactive",
      is_member: data.is_member ?? existing?.is_member ?? false,
    };

    if (existing) {
      await supabase
        .from("profiles")
        .update(payload)
        .eq("stripe_customer_id", customerId);
    } else {
      await supabase.from("profiles").insert(payload);
    }
  }

  // Handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const customer = await getCustomerData(customerId);

      await upsertProfile(customerId, {
        ...customer,
        membership_status: "active",
        is_member: true,
      });
      break;
    }

    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const customer = await getCustomerData(customerId);

      await upsertProfile(customerId, {
        ...customer,
        stripe_subscription_id: sub.id,
        membership_status: "active",
        is_member: true,
        access_until: safeDate(sub.current_period_end),
      });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const customer = await getCustomerData(customerId);

      await upsertProfile(customerId, {
        ...customer,
        stripe_subscription_id: sub.id,
        membership_status: sub.cancel_at_period_end ? "cancelling" : "active",
        is_member: true,
        access_until: safeDate(sub.current_period_end),
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const customer = await getCustomerData(customerId);

      await upsertProfile(customerId, {
        ...customer,
        stripe_subscription_id: null,
        membership_status: "expired",
        is_member: false,
        access_until: safeDate(sub.current_period_end),
      });
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const customer = await getCustomerData(customerId);

      await upsertProfile(customerId, {
        ...customer,
        membership_status: "active",
        is_member: true,
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const customer = await getCustomerData(customerId);

      await upsertProfile(customerId, {
        ...customer,
        membership_status: "past_due",
        is_member: false,
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const customer = await getCustomerData(customerId);

      const subscriptionId = invoice.subscription as string | null;
      const periodEnd = invoice.lines.data[0]?.period?.end ?? null;

      await upsertProfile(customerId, {
        ...customer,
        stripe_subscription_id: subscriptionId,
        membership_status: "active",
        is_member: true,
        access_until: safeDate(periodEnd),
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
