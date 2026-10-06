"use client";

import { useEffect, useState } from "react";
import MembershipGate from "@/components/MembershipGate";
import VideoGrid from "./VideoGrid";

export default function SanctuaryPage() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 tracking-[3px] uppercase">
          Loading Sanctuary...
        </p>
      </main>
    );
  }

  return (
    <MembershipGate>
      <main className="min-h-screen bg-black text-white sanctuary-root">
        {/* HERO VIDEO */}
        <section className="relative w-full h-[130vh] overflow-hidden sanctuary-video">
          <video
            src="/video-season1/season-1-hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* RIGHT‑SIDE SCROLL TEXT + ARROWS */}
          <div className="sea-scroll-right">
            <p className="sea-scroll-word">Scroll</p>

            <div className="sea-scroll-arrows">
              <span className="chevron-line">⌄</span>
              <span className="chevron-line">⌄</span>
            </div>
          </div>

          {/* OVERLAY TEXT */}
          <div
            className="absolute inset-0 flex flex-col justify-end px-10 sanctuary-hero-text"
            style={{ paddingBottom: "51rem" }}
          >
            <p
              className="uppercase text-slate-200 sanctuary-hero-subtitle"
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.38em",
                marginBottom: "1.2rem",
                opacity: 0.92,
              }}
            >
              Welcome Home Beautiful Souls
            </p>

            <h1
              className="font-light text-slate-100 sanctuary-hero-title"
              style={{
                fontSize: "2.9rem",
                lineHeight: "1.45",
                maxWidth: "38rem",
                textShadow: "0 0 22px rgba(0,0,0,0.65)",
              }}
            >
              This is how your story begins.
            </h1>

            <p
              className="text-slate-300 sanctuary-hero-subtext"
              style={{
                marginTop: "1.8rem",
                fontSize: "1.25rem",
                letterSpacing: "0.08em",
                opacity: 0.95,
              }}
            >
              When you feel alive in the moment, your whole life finds its balance.
            </p>
          </div>
        </section>

        <div className="w-full h-42 bg-gradient-to-b from-black/0 to-black"></div>

        <section className="max-w-6xl mx-auto px-6 pb-32">
          <h2 className="text-center text-2xl md:text-3xl font-light mb-12 tracking-wide">
            Your Ritual Journey Into Self
          </h2>

          <VideoGrid />
        </section>

        {/* 🌊 SCROLL TEXT + ARROWS STYLES */}
        <style jsx>{`
          /* RIGHT SIDE POSITIONING */
          .sea-scroll-right {
            position: absolute;
            right: 40px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          /* “Scroll” TEXT — GOLD 400 + STRONG BLACK SHADOW */
          .sea-scroll-word {
            font-size: 1.1rem;
            letter-spacing: 0.14em;
            color: #e1a422; /* Sea Within Gold 400 */
            opacity: 0.95;
            margin-bottom: 8px;
            animation: seaBreath 4.2s ease-in-out infinite;

            text-shadow:
              0 0 4px rgba(0, 0, 0, 0.9),
              0 0 12px rgba(0, 0, 0, 0.7),
              0 0 18px rgba(225, 164, 34, 0.45);
          }

          /* ARROWS BELOW — GOLD 400 + BLACK SHADOW */
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

          /* BREATHING GLOW */
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
    </MembershipGate>
  );
}
