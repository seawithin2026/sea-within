"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function run() {
      // 1. Hydration-safe user fetch
      const first = await supabase.auth.getUser();
      let user = first.data.user;

      if (!user) {
        await new Promise((r) => setTimeout(r, 300));
        const retry = await supabase.auth.getUser();
        user = retry.data.user;

        if (!user) {
          if (active) setStatus("blocked");
          return;
        }
      }

      // 2. Fetch membership
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .maybeSingle();

      const membership = profile?.membership_status?.toLowerCase();

      // 3. Only allow YOUR real states
      const allowed =
        membership === "active" ||
        membership === "cancelling" ||
        membership === "cancel_at_period_end";

      if (!allowed) {
        if (active) setStatus("blocked");
        return;
      }

      if (active) setStatus("allowed");
    }

    run();
    return () => { active = false };
  }, []);

  useEffect(() => {
    if (status === "blocked") {
      window.location.href = "/reveal";
    }
  }, [status]);

  if (status === "loading") {
    return <div className="text-white p-10">Loading...</div>;
  }

  if (status === "blocked") return null;

  return <>{children}</>;
}
