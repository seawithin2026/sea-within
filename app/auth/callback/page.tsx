"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function finishMagicLink() {
      // Wait for Supabase to detect the session in the URL
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/sign-in");
        return;
      }

      const user = session.user;

      // Fetch profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_member, username")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        router.push("/auth/sign-in");
        return;
      }

      // Store membership locally
      localStorage.setItem("isMember", profile.is_member ? "true" : "false");

      // If no username → create username
      if (!profile.username) {
        router.push("/create-username");
        return;
      }

      // If member → sanctuary
      if (profile.is_member) {
        router.push("/sanctuary");
        return;
      }

      // If NOT a member → reveal page
      router.push("/reveal");
    }

    finishMagicLink();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] text-white">
      <p className="text-center opacity-70">Completing sign-in...</p>
    </div>
  );
}
