"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useMembershipGate() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      // 1. Get user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setAllowed(false);
        return;
      }

      // 2. Get membership_status
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .single();

      const status = profile?.membership_status;

      const isMember =
        status === "active" ||
        status === "cancel_at_period_end" ||
        status === "trialing" ||
        status === "past_due" ||
        status === "cancelling";

      setAllowed(isMember);
    }

    check();
  }, []);

  // Redirect after hydration
  useEffect(() => {
    if (allowed === false) {
      router.replace("/reveal");
    }
  }, [allowed]);

  return allowed;
}
