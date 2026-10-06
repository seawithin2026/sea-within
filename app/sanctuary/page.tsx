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

          {/* RIGHT‑SIDE GOLDEN SCROLL ARROW */}
          <div className="sea-scroll-right">
            <div className="sea-scroll-arrow">
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

        {/* 🌊 SCROLL ARROW STYLES */}
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

          /* ARROW STYLE */
          .sea-scroll-arrow {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            color: #f4d79a; /* soft gold */
            animation: seaBreath 4.2s ease-in-out infinite;
            text-shadow:
              0 0 10px rgba(244, 215, 154, 0.45),
              0 0 20px rgba(244, 215, 154, 0.35);
          }

          .chevron-line {
            font-size: 28px;
            line-height: 1;
          }

          /* BREATHING GLOW */
          @keyframes seaBreath {
            0% {
              opacity: 0.45;
              transform: translateY(0);
              text-shadow:
                0 0 6px rgba(244, 215, 154, 0.3),
                0 0 14px rgba(244, 215, 154, 0.2);
            }
            50% {
              opacity: 1;
              transform: translateY(8px);
              text-shadow:
                0 0 14px rgba(244, 215, 154, 0.6),
                0 0 26px rgba(244, 215, 154, 0.45);
            }
            100% {
              opacity: 0.45;
              transform: translateY(0);
              text-shadow:
                0 0 6px rgba(244, 215, 154, 0.3),
                0 0 14px rgba(244, 215, 154, 0.2);
            }
          }
        `}</style>
      </main>
    </MembershipGate>
  );
}
