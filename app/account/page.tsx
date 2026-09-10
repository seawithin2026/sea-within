"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountRouter() {
  const router = useRouter();

  useEffect(() => {
    async function run() {
      // 1. Check session
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        router.replace("/join");
        return;
      }

      // 2. Ensure profile exists (client-side insert)
      const { data: existing } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          is_member: false,
          membership_status: "none",
        });
      }

      // ⭐ 2.5 — Update consent if missing
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

      // 3. Fetch profile again
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_member, membership_status, username")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        router.replace("/join");
        return;
      }

      // 4. Membership logic (Stripe Sync Engine compatible)
      const isActive =
        profile.is_member === true &&
        (
          profile.membership_status === "active" ||
          profile.membership_status === "cancelling"
        );

      if (!isActive) {
        router.replace("/checkout");
        return;
      }

      // 5. Username onboarding
      if (!profile.username) {
        router.replace("/create-username");
        return;
      }

      // 6. Fully onboarded
      router.replace("/sanctuary");
    }

    run();
  }, [router]);

  return null;
}
