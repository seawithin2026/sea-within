"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function CheckoutPage() {
  useEffect(() => {
    async function startCheckout() {
      try {
        // Get Supabase session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          window.location.href = "/join";
          return;
        }

        // Call Supabase Edge Function
        const response = await supabase.functions.invoke("create-checkout");
        console.log("RAW RESPONSE:", response);

        // ⭐ FIX: Supabase returns a JSON STRING, not an object
        const parsed = JSON.parse(response.data);
        const url = parsed.url;

        if (!url) {
          console.error("Stripe URL missing:", response);
          return;
        }

        // Redirect to Stripe Checkout
        window.location.href = url;

      } catch (err) {
        console.error("Checkout error:", err);
      }
    }

    startCheckout();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Redirecting to Stripe…</h1>
    </div>
  );
}
