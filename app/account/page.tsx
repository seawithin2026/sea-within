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

      // 2. Ensure profile row exists (trigger will create it)
      await fetch("/api/profile/init", { method: "POST" });

      // 3. Wait for profile row to exist (fixes JOIN loop)
      let profile = null;
      for (let i = 0; i < 10; i++) {
        const { data } = await supabase
          .from("profiles")
          .select("is_member, membership_status, username")
          .eq("id", user.id)
          .single();

        if (data) {
          profile = data;
          break;
        }

        // Wait 200ms before trying again
        await new Promise((r) => setTimeout(r, 200));
      }

      if (!profile) {
        router.replace("/join");
        return;
      }

      // 4. Determine membership status
      const isActive =
        profile.is_member === true &&
        (profile.membership_status === "active" ||
         profile.membership_status === "cancelling");

      // 5. Not a member → send to Stripe checkout
      if (!isActive) {
        router.replace("/checkout");
        return;
      }

      // 6. Member but no username → onboarding
      if (!profile.username) {
        router.replace("/create-username");
        return;
      }

      // 7. Fully onboarded → sanctuary
      router.replace("/sanctuary");
    }

    run();
  }, [router]);

  return null;
}
