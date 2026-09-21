"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountRouter() {
  const router = useRouter();

  useEffect(() => {
    async function run() {
      // 1. Check session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        router.replace("/login");
        return;
      }

      // 2. Ensure profile exists (SIGNUP already creates it)
      const { data: existing } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!existing) {
        // If no profile, send to login (or onboarding) instead of recreating a broken one
        router.replace("/login");
        return;
      }

      // 3. Ensure consent
      const { data: consentCheck } = await supabase
        .from("profiles")
        .select("terms_accepted")
        .eq("id", user.id)
        .single();

      if (consentCheck?.terms_accepted !== true) {
        await supabase
          .from("profiles")
          .update({
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      }

      // 4. Fetch profile again (minimal fields)
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status, username, stripe_subscription_id, is_member")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        router.replace("/login");
        return;
      }

      // 5. Stripe membership logic — cancelling STILL has access
      const status = profile.membership_status?.toLowerCase();
      const hasAccess =
        status === "active" ||
        status === "cancelling";

      if (!hasAccess) {
        router.replace("/checkout");
        return;
      }

      // 6. Username onboarding
      if (!profile.username) {
        router.replace("/create-username");
        return;
      }

      // 7. Fully onboarded → Sanctuary
      router.replace("/sanctuary");
    }

    run();
  }, [router]);

  return null;
}
