"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "allowed" | "blocked">("loading");

  useEffect(() => {
    let active = true;

    async function run() {
      // 1. Wait for Supabase hydration
      const session = await supabase.auth.getSession();
      let user = session.data.session?.user;

      if (!user) {
        // Retry once after hydration delay
        await new Promise((r) => setTimeout(r, 300));
        const retry = await supabase.auth.getSession();
        user = retry.data.session?.user;

        if (!user) {
          if (active) setStatus("blocked");
          return;
        }
      }

      // 2. Fetch membership safely
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .single();

      const membership = profile?.membership_status?.toLowerCase();

      // ⭐ Only allow the states YOU actually use
      const hasAccess =
        membership === "active" ||
        membership === "cancelling" ||
        membership === "cancel_at_period_end" ||
        membership === "past_due";

      if (!hasAccess) {
        if (active) setStatus("blocked");
        return;
      }

      if (active) setStatus("allowed");
    }

    run();

    return () => {
      active = false;
    };
  }, []);

  // Redirect AFTER hydration finishes
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
