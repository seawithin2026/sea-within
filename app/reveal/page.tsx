"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import Navigation from "@/components/layout/Navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RevealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  /* -----------------------------------------------------
     ⭐ MEMBERSHIP GATE — ONLY SHOW REVEAL TO NON‑MEMBERS
  ----------------------------------------------------- */
  useEffect(() => {
    async function checkMembership() {
      const { data: { session } } = await supabase.auth.getSession();

      // Logged‑out users → allow Reveal
      if (!session) {
        setLoading(false);
        return;
      }

      // Logged‑in → load profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      // No profile → allow Reveal
      if (!profile) {
        setLoading(false);
        return;
      }

      // Membership logic — active OR cancelling = full access
      const allowed =
        profile.is_member &&
        (profile.membership_status === "active" ||
         profile.membership_status === "cancelling");

      // Logged‑in member → redirect to Sanctuary
      if (allowed) {
        router.replace("/sanctuary");
        return;
      }

      // Logged‑in non‑member → show Reveal
      setLoading(false);
    }

    checkMembership();
  }, []);

  if (loading) return null;

  /* -----------------------------------------------------
     ⭐ VIDEO AUDIO CONTROL — YOUR ORIGINAL CODE
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

      <section className="relative px-6 pt-32 pb-40 max-w-3xl mx-auto">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-golden-400/5 blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[420px] h-[420px] rounded-full bg-sea-400/10 blur-[120px]" />
        </div>

        {/* Opening whisper */}
        <ScrollReveal delay={100}>
          <p className="font-whisper text-center text-golden-400/60 tracking-[6px] uppercase mb-6">
            a quiet unveiling
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <h1 className="font-display text-4xl md:text-5xl text-center font-light mb-10 leading-snug">
            If you’ve made it this far…
            <br />
            <span className="text-golden-400/80">
              something in you recognizes this place.
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <p className="font-body text-lg leading-relaxed text-white/70 mb-14 text-center">
            Not from memory — from instinct. From that quiet inner knowing that has
            followed you your whole life, waiting for somewhere it could finally rest.
            Sea Within is not a program. It is a belonging — the kind you&apos;ve felt
            in your chest long before you ever had words for it.
          </p>
        </ScrollReveal>

        {/* The Descent */}
        <ScrollReveal delay={400}>
          <h2 className="font-display text-3xl font-light mb-4">The Descent</h2>
          <p className="font-body text-white/60 leading-relaxed mb-14">
            As you move deeper, imagine the world above softening. Light bending.
            Sound dissolving. Everything slowing into something gentler, truer.
          </p>
        </ScrollReveal>

        {/* What Sea Within Is */}
        <ScrollReveal delay={500}>
          <h2 className="font-display text-3xl font-light mb-4">What Sea Within Is</h2>
          <p className="font-body text-white/60 leading-relaxed mb-14">
            Sea Within is a sanctuary for your inner world — a cinematic ritual space you enter 
            when life feels loud and you need a moment that feels like breath again.
          </p>
        </ScrollReveal>

        {/* Gathering Circle */}
        <ScrollReveal delay={600}>
          <h2 className="font-display text-3xl font-light mb-4">The Gathering Circle</h2>
          <p className="font-body text-white/60 leading-relaxed mb-14">
            You walk your inner world alone — but you don&apos;t have to feel alone inside it.
          </p>
        </ScrollReveal>

        {/* What You Receive */}
        <ScrollReveal delay={700}>
          <h2 className="font-display text-3xl font-light mb-4">What You Receive</h2>
          <p className="font-body text-white/60 leading-relaxed mb-14">
            You don&apos;t receive content — you receive experiences.
          </p>
        </ScrollReveal>

        {/* Transformation */}
        <ScrollReveal delay={800}>
          <h2 className="font-display text-3xl font-light mb-4">The Transformation</h2>
          <p className="font-body text-white/60 leading-relaxed mb-14">
            Sea Within is for those who feel everything and carry it alone.
          </p>
        </ScrollReveal>

        {/* CINEMATIC FULL‑BLEED VIDEO */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-visible">
          <video
            id="marketingVideo"
            src="/videos/marketing.mp4"
            playsInline
            className="w-full h-auto object-contain"
            controls
          />
        </div>

        {/* Invitation + Buttons */}
        <ScrollReveal delay={900}>
          <div className="mt-12"></div>
          <h2 className="font-display text-3xl font-light mb-4">The Invitation</h2>
          <p className="font-body text-white/60 leading-relaxed mb-8">
            If something in you is leaning forward — if something in you is quietly
            whispering yes — the sanctuary is open.
          </p>

          <button
            onClick={() => window.location.href = "/login"}
            className="btn-golden w-full text-center py-4 text-lg block"
          >
            Enter the Sanctuary — $77.77/month
          </button>
        </ScrollReveal>

      </section>
    </main>
  );
}
