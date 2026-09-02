"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountRouter() {
  const router = useRouter();

  useEffect(() => {
    async function run() {
      // 1. Check authentication
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/join");
        return;
      }

      // 2. Ensure profile row exists
      await fetch("/api/profile/init", { method: "POST" });

      // 3. Load profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_member, membership_status, username")
        .eq("id", user.id)
        .single();

      if (!profile) {
        router.replace("/join");
        return;
      }

      // 4. Not a member → send to Stripe checkout
      const isActive =
        profile.is_member === true &&
        (profile.membership_status === "active" ||
         profile.membership_status === "cancelling");

      if (!isActive) {
        router.replace("/checkout");
        return;
      }

      // 5. Member but no username → onboarding
      if (!profile.username) {
        router.replace("/create-username");
        return;
      }

      // 6. Fully onboarded → sanctuary
      router.replace("/sanctuary");
    }

    run();
  }, [router]);

  return null; // This page never renders UI
}
