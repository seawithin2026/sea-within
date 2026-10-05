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

function getCustomerId(customer: any): string {
  if (!customer) throw new Error("Stripe event missing customer ID");
  return typeof customer === "string" ? customer : customer.id;
}

async function getCustomerData(customerId: string) {
  const rawCustomer = await stripe.customers.retrieve(customerId);
  if (rawCustomer.deleted) return { email: null };
  return { email: rawCustomer.email ?? null };
}

/* Cancelling users STILL have access */
function isMember(status: Stripe.Subscription.Status): boolean {
  return ["active", "trialing"].includes(status);
}

/* Update existing profile only */
async function updateProfileForCustomer(
  customerId: string,
  data: {
    email?: string | null;
    stripe_subscription_id?: string | null;
    membership_status?: string | null;
    is_member?: boolean;
  }
) {
  const { data: profile, error: lookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (lookupError || !profile) {
    console.error("Profile lookup failed:", { customerId, lookupError });
    return;
  }

  const payload = {
    email: data.email ?? null,
    stripe_subscription_id: data.stripe_subscription_id ?? null,
    membership_status: data.membership_status ?? "inactive",
    is_member: data.is_member ?? false,
  };

  const { error: updateError } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", profile.id);

  if (updateError) {
    console.error("Supabase profile update failed:", {
      customerId,
      profileId: profile.id,
      payload,
      updateError,
    });
  }
}

/* Checkout completed */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = getCustomerId(session.customer);
  const customer = await getCustomerData(customerId);

  let subscriptionId: string | null = null;
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

    member = isMember(subscription.status);
  }

  await updateProfileForCustomer(customerId, {
    email: customer.email,
    stripe_subscription_id: subscriptionId,
    membership_status: membershipStatus,
    is_member: member,
  });
}

/* Subscription updated or created */
async function handleSubscription(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription.customer);
  const customer = await getCustomerData(customerId);

  const membershipStatus = subscription.cancel_at_period_end
    ? "cancelling"
    : subscription.status;

  await updateProfileForCustomer(customerId, {
    email: customer.email,
    stripe_subscription_id: subscription.id,
    membership_status: membershipStatus,
    is_member: isMember(subscription.status),
  });
}

/* Subscription deleted — remove access */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription.customer);
  const customer = await getCustomerData(customerId);

  await updateProfileForCustomer(customerId, {
    email: customer.email,
    stripe_subscription_id: null,
    membership_status: "expired",
    is_member: false,
  });
}

/* Invoice paid */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = getCustomerId(invoice.customer);
  const customer = await getCustomerData(customerId);

  if (invoice.subscription) {
    const subscriptionId =
      typeof invoice.subscription === "string"
        ? invoice.subscription
        : invoice.subscription.id;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const membershipStatus = subscription.cancel_at_period_end
      ? "cancelling"
      : subscription.status;

    await updateProfileForCustomer(customerId, {
      email: customer.email,
      stripe_subscription_id: subscription.id,
      membership_status: membershipStatus,
      is_member: isMember(subscription.status),
    });

    return;
  }

  await updateProfileForCustomer(customerId, {
    email: customer.email,
    membership_status: "active",
    is_member: true,
  });
}

/* Invoice failed — remove access */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = getCustomerId(invoice.customer);
  const customer = await getCustomerData(customerId);

  await updateProfileForCustomer(customerId, {
    email: customer.email,
    membership_status: "past_due",
    is_member: false,
  });
}

/* Webhook server */
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

    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscription(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ received: false, error: "Event processing failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
