"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function finishMagicLink() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth/signin");
        return;
      }

      const user = session.user;

      // Read session_id from URL
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_member, membership_status")
        .eq("id", user.id)
        .single();

      // If no profile → username creation
      if (!profile) {
        router.replace("/create-username");
        return;
      }

      // ⭐ If user just completed checkout → send to sanctuary immediately
      if (sessionId) {
        router.replace("/sanctuary");
        return;
      }

      // ⭐ If member → sanctuary
      if (profile.is_member === true) {
        router.replace("/sanctuary");
        return;
      }

      // ⭐ Otherwise → reveal
      router.replace("/reveal");
    }

    finishMagicLink();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] text-white">
      <p className="text-center opacity-70">Completing sign-in...</p>
    </div>
  );
}
