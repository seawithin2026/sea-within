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
      // 1. Hydration-safe user fetch
      const first = await supabase.auth.getUser();
      let user = first.data.user;

      if (!user) {
        await new Promise((r) => setTimeout(r, 300));
        const retry = await supabase.auth.getUser();
        user = retry.data.user;

        if (!user) {
          if (active) setAllowed(false);
          return;
        }
      }

      // 2. Fetch membership
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .maybeSingle();

      const status = profile?.membership_status?.toLowerCase();

      // 3. Only allow YOUR real states
      const isMember =
        status === "active" ||
        status === "cancelling";

      if (active) setAllowed(isMember);
    }

    check();
    return () => { active = false };
  }, []);

  // 4. Redirect AFTER hydration
  useEffect(() => {
    if (allowed === false) {
      router.replace("/reveal");
    }
  }, [allowed]);

  return allowed;
}
