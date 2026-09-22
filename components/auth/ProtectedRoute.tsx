"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function run() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (active) setStatus("blocked");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .maybeSingle();

      const membership = profile?.membership_status?.toLowerCase();

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
