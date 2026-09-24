"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function useMembershipGate() {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    async function check() {
      const { data: { user } } = await supabase.auth.getUser();

      // ⭐ FIX: do NOT block when client hasn't loaded session yet
      if (!user) {
        if (active) setAllowed(null); 
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .maybeSingle();

      const status = profile?.membership_status?.toLowerCase();

      const isMember =
        status === "active" ||
        status === "cancelling";

      if (active) setAllowed(isMember);
    }

    check();
    return () => { active = false };
  }, []);

  return allowed;
}
