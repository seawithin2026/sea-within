import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12";

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: authData } = await supabase.auth.getUser(token);

    const user = authData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-04-10",
    });

    // ⭐ CREATE STRIPE CUSTOMER IF MISSING
    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
      });

      customerId = customer.id;

      // Save customer ID in Supabase
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // ⭐ CREATE CHECKOUT SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: Deno.env.get("STRIPE_PRICE_ID")!,
          quantity: 1,
        },
      ],
      success_url: Deno.env.get("STRIPE_SUCCESS_URL")!,
      cancel_url: Deno.env.get("STRIPE_CANCEL_URL")!,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
    });

  } catch (err) {
    console.error("Checkout Error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
});
