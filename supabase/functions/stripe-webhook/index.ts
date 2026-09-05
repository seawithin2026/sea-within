import Stripe from "npm:stripe@16.12.0";
import { createClient } from "jsr:@supabase/supabase-js@2";

function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const stripe = new Stripe(requiredEnv("STRIPE_SECRET_KEY"), {
  apiVersion: "2024-04-10",
});

const supabase = createClient(
  requiredEnv("PROJECT_URL"),
  requiredEnv("SERVICE_ROLE_KEY")
);

const cryptoProvider = Stripe.createSubtleCryptoProvider();

function safeDate(timestamp: number | null | undefined): string | null {
  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
}

function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): string {
  if (!customer) throw new Error("Stripe event missing customer ID");
  return typeof customer === "string" ? customer : customer.id;
}

async function getCustomerData(customerId: string) {
  const rawCustomer = await stripe.customers.retrieve(customerId);

  if (rawCustomer.deleted) {
    return { email: null, country: null, full_name: null };
  }

  const customer = rawCustomer as Stripe.Customer;

  return {
    email: customer.email ?? null,
    country: customer.address?.country ?? null,
    full_name: customer.name ?? null,
  };
}

function isMember(
  status: Stripe.Subscription.Status,
  cancelAtPeriodEnd: boolean
): boolean {
  return ["active", "trialing"].includes(status) && !cancelAtPeriodEnd;
}

async function upsertProfile(
  customerId: string,
  data: {
    email?: string | null;
    country?: string | null;
    full_name?: string | null;
    stripe_subscription_id?: string | null;
    access_until?: string | null;
    membership_status?: string | null;
    is_member?: boolean;
  }
) {
  const payload = {
    stripe_customer_id: customerId,
    email: data.email ?? null,
    country: data.country ?? null,
    full_name: data.full_name ?? null,
    stripe_subscription_id: data.stripe_subscription_id ?? null,
    access_until: data.access_until ?? null,
    membership_status: data.membership_status ?? "inactive",
    is_member: data.is_member ?? false,
  };

  const { data: savedProfile, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "stripe_customer_id" })
    .select()
    .single();

  if (error) {
    console.error("Supabase profile upsert failed:", { customerId, payload, error });
    throw error;
  }

  console.log("Profile saved:", {
    customerId,
    profileId: savedProfile?.id ?? null,
  });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = getCustomerId(session.customer);
  const customer = await getCustomerData(customerId);

  let subscriptionId: string | null = null;
  let accessUntil: string | null = null;
  let membershipStatus = "active";
  let member = true;

  if (session.subscription) {
    subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription.id;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    membershipStatus = subscription.cancel_at_period_end
      ? "cancelling"
      : subscription.status;

    member = isMember(subscription.status, subscription.cancel_at_period_end);
    accessUntil = safeDate(subscription.current_period_end);
  }

  await upsertProfile(customerId, {
    ...customer,
    stripe_subscription_id: subscriptionId,
    access_until: accessUntil,
    membership_status: membershipStatus,
    is_member: member,
  });
}

async function handleSubscription(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription.customer);
  const customer = await getCustomerData(customerId);

  await upsertProfile(customerId, {
    ...customer,
    stripe_subscription_id: subscription.id,
    access_until: safeDate(subscription.current_period_end),
    membership_status: subscription.cancel_at_period_end
      ? "cancelling"
      : subscription.status,
    is_member: isMember(subscription.status, subscription.cancel_at_period_end),
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription.customer);
  const customer = await getCustomerData(customerId);

  await upsertProfile(customerId, {
    ...customer,
    stripe_subscription_id: null,
    access_until: safeDate(subscription.current_period_end),
    membership_status: "expired",
    is_member: false,
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = getCustomerId(invoice.customer);
  const customer = await getCustomerData(customerId);

  if (invoice.subscription) {
    const subscriptionId =
      typeof invoice.subscription === "string"
        ? invoice.subscription
        : invoice.subscription.id;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await upsertProfile(customerId, {
      ...customer,
      stripe_subscription_id: subscription.id,
      access_until: safeDate(subscription.current_period_end),
      membership_status: subscription.cancel_at_period_end
        ? "cancelling"
        : subscription.status,
      is_member: isMember(subscription.status, subscription.cancel_at_period_end),
    });

    return;
  }

  await upsertProfile(customerId, {
    ...customer,
    membership_status: "active",
    is_member: true,
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = getCustomerId(invoice.customer);
  const customer = await getCustomerData(customerId);

  await upsertProfile(customerId, {
    ...customer,
    membership_status: "past_due",
    is_member: false,
  });
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let event: Stripe.Event;

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    const rawBody = await req.text();

    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      requiredEnv("STRIPE_WEBHOOK_SECRET"),
      undefined,
      cryptoProvider
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid webhook signature";
    console.error("Stripe signature verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  console.log("Stripe event received:", { id: event.id, type: event.type });

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscription(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_succeeded":
        console.log("Ignoring invoice.payment_succeeded; invoice.paid handles it.");
        break;

      default:
        console.log("Unhandled Stripe event:", event.type);
        break;
    }

    return new Response(
      JSON.stringify({ received: true, event_id: event.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Stripe event processing failed:", {
      eventId: event.id,
      eventType: event.type,
      error,
    });

    return new Response(
      JSON.stringify({ received: false, error: "Event processing failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
