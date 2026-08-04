"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function finishMagicLink() {
      // 1. Wait for Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/signin");
        return;
      }

      const user = session.user;

      // ⭐ 2. Ensure profile exists (CRITICAL FIX)
      await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          joined_at: new Date().toISOString(),
        });

      // 3. Get session_id from URL
      const sessionId = searchParams.get("session_id");

      if (sessionId) {
        // 4. Fetch Stripe Checkout Session from backend
        const res = await fetch(
          "/api/stripe/get-session?session_id=" + sessionId
        );
        const stripeSession = await res.json();

        if (stripeSession?.customer) {
          // ⭐ 5. Save Stripe customer ID into profile
          await supabase
            .from("profiles")
            .update({
              stripe_customer_id: stripeSession.customer,
            })
            .eq("id", user.id);
        }
      }

      // 6. Fetch updated profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_member, username")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        router.push("/auth/signin");
        return;
      }

      // 7. Store membership locally
      localStorage.setItem("isMember", profile.is_member ? "true" : "false");

      // 8. Username flow
      if (!profile.username) {
        router.push("/create-username");
        return;
      }

      // 9. Member → sanctuary
      if (profile.is_member) {
        router.push("/sanctuary");
        return;
      }

      // 10. Not a member → reveal page
      router.push("/reveal");
    }

    finishMagicLink();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] text-white">
      <p className="text-center opacity-70">Completing signin...</p>
    </div>
  );
}
