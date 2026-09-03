"use client";

import { useEffect } from "react";

export default function CheckoutPage() {
  useEffect(() => {
    async function startCheckout() {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          body: JSON.stringify({ plan: "monthly" }),
        });

        const data = await res.json();

        if (data?.url) {
          window.location.href = data.url;
        } else {
          console.error("Stripe URL missing:", data);
        }
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
