"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountRouter() {
  const router = useRouter();

  useEffect(() => {
    async function run() {
      // 1. Check session (more reliable than getUser)
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        router.replace("/join");
        return;
      }

      // 2. Ensure profile row exists — MUST send cookies
      await fetch("/api/profile/init", {
        method: "POST",
        credentials: "include",
      });

      // 3. Poll until profile exists
      let profile = null;
      for (let i = 0; i < 10; i++) {
        const { data } = await supabase
          .from("profiles")
          .select("is_member, membership_status")
          .eq("id", user.id)
          .maybeSingle();


        if (data) {
          profile = data;
          break;
        }

        await new Promise((r) => setTimeout(r, 200));
      }

      if (!profile) {
        router.replace("/join");
        return;
      }

      // 4. Membership logic
      const isActive =
        profile.is_member === true &&
        (profile.membership_status === "active" ||
         profile.membership_status === "cancelling");

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
