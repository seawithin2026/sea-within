"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import Navigation from "@/components/layout/Navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function RevealPage() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  // ⭐ NEW — Track scroll progress for moving + disappearing arrow
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // MEMBERSHIP CHECK
  useEffect(() => {
    async function checkMembership() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_member, membership_status")
        .eq("id", session.user.id)
        .single();

      if (!profile) {
        setLoading(false);
        return;
      }

      const allowed =
        profile.is_member &&
        (profile.membership_status === "active" ||
          profile.membership_status === "cancelling");

      setLoading(false);
    }

    checkMembership();
  }, []);

  // HYDRATION GUARD
  useEffect(() => {
    setReady(true);
  }, []);

  // VIDEO + AUDIO CONTROL
  useEffect(() => {
    if (!ready) return;

    const marketingVideo = document.getElementById(
      "marketingVideo"
    ) as HTMLVideoElement | null;
    const seaAudio = document.getElementById(
      "seaAudio"
    ) as HTMLAudioElement | null;

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

    return () => {
      window.removeEventListener("touchstart", enableSound);
      window.removeEventListener("click", enableSound);
    };
  }, [ready]);

  // LOADING SKELETON
  if (loading || !ready) {
    return (
      <main className="min-h-screen bg-sanctuary-dark text-sea-100">
        <Navigation />
        <section className="px-6 pt-32 pb-40 max-w-3xl mx-auto">
          <p className="text-white/40 tracking-[3px] uppercase text-center">
            Preparing your experience…
          </p>
        </section>
      </main>
    );
  }

  // FULL PAGE CONTENT
  return (
    <main className="min-h-screen bg-sanctuary-dark text-sea-100">
      <Navigation />

      <section className="relative px-6 pt-32 pb-40 max-w-3xl mx-auto">
        {/* ⭐ RIGHT‑SIDE SCROLL TEXT + ARROWS — MOVING + FADING */}
        <div
          className="sea-scroll-right"
          style={{
            opacity: scrollProgress < 0.92 ? 1 - scrollProgress : 0,
            transform: `translateY(calc(-50% + ${scrollProgress * 20}px))`,
          }}
        >
          <p className="sea-scroll-word">SCROLL</p>

          <div className="sea-scroll-arrows">
            <span className="chevron-line">⌄</span>
            <span className="chevron-line">⌄</span>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-golden-400/5 blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[420px] h-[420px] rounded-full bg-sea-400/10 blur-[120px]" />
        </div>

        {/* Opening whisper */}
        {ready && (
          <ScrollReveal delay={100}>
            <p className="font-whisper text-center text-golden-400/60 tracking-[6px] uppercase mb-6">
              a quiet unveiling
            </p>
          </ScrollReveal>
        )}

        {ready && (
          <ScrollReveal delay={200}>
            <h1 className="font-display text-4xl md:text-5xl text-center font-light mb-10 leading-snug">
              If you’ve made it this far…
              <br />
              <span className="text-golden-400/80">
                something in you recognizes this place.
              </span>
            </h1>
          </ScrollReveal>
        )}

        {ready && (
          <ScrollReveal delay={300}>
            <p className="font-body text-lg leading-relaxed text-white/70 mb-14 text-center">
              Not from memory — from instinct. From that quiet inner knowing that
              has followed you your whole life, waiting for somewhere it could
              finally rest. Sea Within is not a program. It is a belonging — the
              kind you’ve felt in your chest long before you ever had words for it.
            </p>
          </ScrollReveal>
        )}

        {/* Welcome to Sea Within */}
        {ready && (
          <ScrollReveal delay={400}>
            <h2 className="font-display text-3xl font-light mb-4">
              Welcome to Sea Within
            </h2>
            <p className="font-body text-white/60 leading-relaxed mb-14">
             Sea Within is a sanctuary for growth, reflection, and self-discovery.
             In a world that often asks us to wear masks and meet endless expectations, Sea Within offers a space to slow down, reconnect with yourself, and remember the beauty that has been within you all along.
             Every journey is unique. There is no right or wrong way to experience Sea Within. Move at your own pace, follow your intuition, and explore what speaks to you.

            </p>
          </ScrollReveal>
        )}

        {/* Sanctuary */}
        {ready && (
          <ScrollReveal delay={500}>
            <h2 className="font-display text-3xl font-light mb-4">
              The Sanctuary
            </h2>
            <p className="font-body text-white/60 leading-relaxed mb-14">
              The Sanctuary is a library of guided rituals designed to support your personal growth and wellbeing.
              Each day contains three simple rituals that can be completed at your own pace.
              You can choose to follow the journey day by day, or explore whichever day feels most meaningful to you in the present moment. There is no pressure to keep up and no expectation to follow a specific path.
              Trust yourself. The experience is yours to create.

            </p>
          </ScrollReveal>
        )}

        {/* Bloom */}
        {ready && (
          <ScrollReveal delay={600}>
            <h2 className="font-display text-3xl font-light mb-4">
              Bloom
            </h2>
            <p className="font-body text-white/60 leading-relaxed mb-14">
              Bloom offers a daily opportunity to give yourself a moment of care and presence.
              Each day you will receive a gentle gesture designed to help you pause, reflect, and reconnect with yourself.
              Once you complete the gesture a special video will be revealed to you.

            </p>
          </ScrollReveal>
        )}

        {/* Wisdom Board */}
        {ready && (
          <ScrollReveal delay={700}>
            <h2 className="font-display text-3xl font-light mb-4">
              The Wisdom Board
            </h2>
            <p className="font-body text-white/60 leading-relaxed mb-14">
              The Wisdom Board is a place of shared inspiration.
              Each day you will receive a message of wisdom drawn from the Sea Within community.
              These messages are designed to offer a moment of reflection, encouragement, and perspective. Sometimes a single sentence can brighten a day, offer comfort, or remind us of a truth we needed to hear.

            </p>
          </ScrollReveal>
        )}

        {/* Community */}
        {ready && (
          <ScrollReveal delay={800}>
            <h2 className="font-display text-3xl font-light mb-4">
              The Community
            </h2>
            <p className="font-body text-white/60 leading-relaxed mb-14">
              The Community is a place to connect with like-minded souls walking their own journeys of growth and self-discovery.
              Share uplifting messages, personal reflections, lessons you've learned along the way, and moments that have inspired you.
              Here, you may find encouragement, meaningful conversations, new friendships, and a sense of belonging among people who understand the importance of personal growth and authentic living.
              You are never walking this journey alone.


            </p>
          </ScrollReveal>
        )}

        {/* CINEMATIC FULL‑BLEED VIDEO */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-visible">
          <video
            id="invitationVideo"
            src="/videos/invitation.mp4"
            playsInline
            className="w-full h-auto object-contain"
            controls
          />
        </div>

        {/* Invitation */}
        {ready && (
          <ScrollReveal delay={900}>
            <div className="mt-12"></div>
            <h2 className="font-display text-3xl font-light mb-4">
              The Invitation
            </h2>
            <p className="font-body text-white/60 leading-relaxed mb-8">
              If something in you is leaning forward — if something in you is
              quietly whispering yes — the sanctuary is open.
            </p>

            <button
              onClick={() => (window.location.href = "/login")}
              className="btn-golden w-full text-center py-4 text-lg block"
            >
              Enter the Sanctuary — $77.77/month
            </button>
          </ScrollReveal>
        )}
      </section>

      {/* ⭐ SCROLL ARROW STYLES */}
      <style jsx global>{`
        .sea-scroll-right {
          position: fixed;
          right: 40px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: opacity 0.4s ease;
        }

        .sea-scroll-word {
          font-size: 1.1rem;
          letter-spacing: 0.14em;
          color: #e1a422;
          opacity: 0.95;
          margin-bottom: 8px;
          animation: seaBreath 4.2s ease-in-out infinite;
          text-shadow:
            0 0 4px rgba(0, 0, 0, 0.9),
            0 0 12px rgba(0, 0, 0, 0.7),
            0 0 18px rgba(225, 164, 34, 0.45);
        }

        .sea-scroll-arrows {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          color: #e1a422;
          animation: seaBreath 4.2s ease-in-out infinite;
        }

        .chevron-line {
          font-size: 28px;
          line-height: 1;
          text-shadow:
            0 0 4px rgba(0, 0, 0, 0.9),
            0 0 12px rgba(0, 0, 0, 0.7),
            0 0 18px rgba(225, 164, 34, 0.45);
        }

        @keyframes seaBreath {
          0% {
            opacity: 0.45;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(8px);
          }
          100% {
            opacity: 0.45;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
