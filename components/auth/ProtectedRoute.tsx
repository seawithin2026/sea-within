"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "allowed" | "blocked">("loading");

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      // 1. Get user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setStatus("blocked");
        return;
      }

      // 2. Check membership
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_member")
        .eq("id", user.id)
        .single();

      if (!profile?.is_member) {
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
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }

  if (status === "blocked") return null;

  return <>{children}</>;
}
