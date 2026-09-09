"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function CheckoutPage() {
  useEffect(() => {
    async function startCheckout() {
      try {
        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          window.location.href = "/join";
          return;
        }

        // Call Supabase Edge Function
        const { data, error } = await supabase.functions.invoke("create-checkout");

        if (error || !data?.url) {
          console.error("Stripe URL missing:", error || data);
          return;
        }

        // Redirect to Stripe Checkout
        window.location.href = data.url;

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
