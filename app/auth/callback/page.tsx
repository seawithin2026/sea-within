"use client";



import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";




export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function completeSignIn() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        router.replace("/auth/signin");
        return;
      }

      // 1. Merge webhook row → auth row
      await fetch("/api/profile/merge-from-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      // 2. Wait for membership to update
      let tries = 0;
      let profile = null;

      while (tries < 5) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        profile = data;

        if (profile?.is_member === true) break;

        await new Promise((r) => setTimeout(r, 300));
        tries++;
      }

      // 3. Redirect only when membership is ready
      if (profile?.is_member) {
        router.replace("/sanctuary");
      } else {
        router.replace("/account");
      }
    }

    completeSignIn();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] text-white">
      <p className="text-center opacity-70">Completing signin...</p>
    </div>
  );
}
