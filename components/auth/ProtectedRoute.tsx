"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "allowed" | "blocked">("loading");

  useEffect(() => {
    const run = async () => {
      // 1. Get user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setStatus("blocked");
        return;
      }

      // 2. Check membership_status
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .single();

      const membership = profile?.membership_status?.toLowerCase();

      // ⭐ Only allow ACTIVE or CANCELLING
      const hasAccess =
        membership === "active" ||
        membership === "cancelling";

      if (!hasAccess) {
        setStatus("blocked");
        return;
      }

      // 3. All good
      setStatus("allowed");
    };

    run();
  }, []);

  // Redirect safely AFTER hydration
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
