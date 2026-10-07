"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountRouter() {
  const router = useRouter();

  useEffect(() => {
    async function run() {
      // 1. Get user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // 2. Fetch or create profile
      let { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          is_member: false,
          membership_status: "none",
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
        });

        const { data: newProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        profile = newProfile;
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

      // 4. Membership check
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

      // ⭐ STEP 6 — Fully onboarded → go to account
      router.replace("/account");

      // ⭐ STEP 7 — After 5 seconds → redirect to Sanctuary
      setTimeout(() => {
        router.replace("/sanctuary");
      }, 3000);
    }

    run();
  }, [router]);

  return null;
}