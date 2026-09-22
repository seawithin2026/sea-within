"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useMembershipGate() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    async function check() {
      // 1. Wait for Supabase hydration
      const session = await supabase.auth.getSession();
      const user = session.data.session?.user;

      if (!user) {
        // Retry once after hydration delay
        await new Promise((r) => setTimeout(r, 300));
        const retry = await supabase.auth.getSession();
        const retryUser = retry.data.session?.user;

        if (!retryUser) {
          if (active) setAllowed(false);
          return;
        }

        // Use retry user
        user = retryUser;
      }

      // 2. Fetch profile safely
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .single();

      const status = profile?.membership_status;

      // 3. Membership logic (Stripe-compatible)
      const isMember =
        status === "active" ||
        status === "trialing" ||
        status === "past_due" ||
        status === "cancel_at_period_end" ||
        status === "cancelling";

      if (active) setAllowed(isMember);
    }

    check();

    return () => {
      active = false;
    };
  }, []);

  // 4. Redirect only AFTER hydration is complete
  useEffect(() => {
    if (allowed === false) {
      router.replace("/reveal");
    }
  }, [allowed]);

  return allowed;
}
