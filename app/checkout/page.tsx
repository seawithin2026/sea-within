"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import AccountRouter from "@/components/AccountRouter";

export default function CheckoutPage() {
  return (
    <>
      {/* ⭐ AccountRouter — onboarding brain */}
      <AccountRouter />

      <CheckoutRedirect />
    </>
  );
}

/* -----------------------------------------------------
   ⭐ CheckoutRedirect — runs AFTER AccountRouter
----------------------------------------------------- */
function CheckoutRedirect() {
  useEffect(() => {
    async function startCheckout() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          window.location.href = "/login";
          return;
        }

        // Call Supabase Edge Function
        const response = await supabase.functions.invoke("create-checkout");

        // Supabase returns a JSON STRING
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
