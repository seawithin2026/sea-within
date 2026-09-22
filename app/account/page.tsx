"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountRouter() {
  const router = useRouter();
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
          if (active) setStatus("login");
          return;
        }
      }

      // 2. Fetch profile once
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status, username, stripe_subscription_id, is_member, terms_accepted")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        if (active) setStatus("login");
        return;
      }

      // 3. Ensure consent
      if (profile.terms_accepted !== true) {
        await supabase
          .from("profiles")
          .update({
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      }

      // 4. Membership logic
      const statusLower = profile.membership_status?.toLowerCase();
      const hasAccess =
        statusLower === "active" ||
        statusLower === "cancelling";

      if (!hasAccess) {
        if (active) setStatus("checkout");
        return;
      }

      // 5. Username onboarding
      if (!profile.username) {
        if (active) setStatus("username");
        return;
      }

      // 6. Fully onboarded
      if (active) setStatus("sanctuary");
    }

    run();

    return () => {
      active = false;
    };
  }, [router]);

  // 7. Redirect AFTER hydration
  useEffect(() => {
    if (status === "login") router.replace("/login");
    if (status === "checkout") router.replace("/checkout");
    if (status === "username") router.replace("/create-username");
    if (status === "sanctuary") router.replace("/sanctuary");
  }, [status, router]);

  return null;
}
