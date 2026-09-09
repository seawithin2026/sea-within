"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function CheckoutPage() {
  useEffect(() => {
    async function startCheckout() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          window.location.href = "/join";
          return;
        }

        // Call Supabase Edge Function
        const response = await supabase.functions.invoke("create-checkout");
        console.log("RAW RESPONSE:", response);

        // The ONLY correct place the URL exists
        const url = response?.data?.url;

        if (!url) {
          console.error("Stripe URL missing:", response);
          return;
        }

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
