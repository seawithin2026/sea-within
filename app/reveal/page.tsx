"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import Navigation from "@/components/layout/Navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function RevealPage() {

  /* -----------------------------------------------------
     ⭐ MEMBER REDIRECT — NEW LOGIC (FIXED)
  ----------------------------------------------------- */
  useEffect(() => {
    async function checkMembership() {

      // ⭐ REQUIRED FIX — hydrate session BEFORE reading user
      await supabase.auth.getSession();

      // 1. Hydration-safe user fetch
      const first = await supabase.auth.getUser();
      let user = first.data.user;

      if (!user) return; // Non-member → stay on Reveal

      // 2. Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) return;

      const status = profile.membership_status?.toLowerCase();

      // 3. Active or Cancelling → redirect to Sanctuary
      if (status === "active" || status === "cancelling") {
        window.location.href = "/sanctuary";
      }
    }

    checkMembership();
  }, []);

  /* -----------------------------------------------------
     ⭐ VIDEO AUDIO CONTROL — ONLY ADDITION
  ----------------------------------------------------- */
  useEffect(() => {
    const marketingVideo = document.getElementById("marketingVideo") as HTMLVideoElement | null;
    const seaAudio = document.getElementById("seaAudio") as HTMLAudioElement | null;

    if (!marketingVideo || !seaAudio) return;

    marketingVideo.addEventListener("play", () => {
      seaAudio.pause();
    });

    const enableSound = () => {
      marketingVideo.muted = false;
      window.removeEventListener("touchstart", enableSound);
      window.removeEventListener("click", enableSound);
    };

    window.addEventListener("touchstart", enableSound);
    window.addEventListener("click", enableSound);

    marketingVideo.addEventListener("ended", () => {
      seaAudio.play();
    });
  }, []);

  return (
    <main className="min-h-screen bg-sanctuary-dark text-sea-100">
      <Navigation />

      {/* ...rest of your RevealPage unchanged... */}
    </main>
  );
}
