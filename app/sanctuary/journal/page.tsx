"use client";

import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { BloomReveal } from "@/components/bloom/BloomReveal";

export default function BloomJournalPage() {
  // Whether today's ritual is earned / available
  const [earned, setEarned] = useState(true);

  function handleRitualComplete() {
    // After ritual completes, mark it as done for the day
    setEarned(false);
  }

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20 pb-16">

        {/* HERO */}
        <section className="px-6 md:px-10 lg:px-16 max-w-6xl mx-auto text-center md:text-left">
          <p className="text-[11px] tracking-[0.28em] uppercase text-white/40">
            Sanctuary • Daily Ritual
          </p>

          <h1 className="mt-3 text-3xl md:text-4xl lg:text-[2.8rem] tracking-[0.16em] uppercase text-white/90">
            Your Daily Bloom Ritual
          </h1>

          <p className="mt-4 max-w-2xl text-sm md:text-base text-white/60 mx-auto md:mx-0">
            Move through your 25‑step cinematic ritual.  
            Each step is a moment of devotion to yourself — a quiet unfolding.
          </p>
        </section>

        {/* PROGRESS STRIP */}
        <section className="mt-10 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto">
          <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-950 px-5 py-4 md:px-7 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-emerald-400/70 to-sky-500/70 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.7)]">
                <div className="h-6 w-6 rounded-full bg-slate-950 flex items-center justify-center">
                  <span className="text-[11px] tracking-[0.18em] uppercase text-emerald-300">
                    Seed
                  </span>
                </div>
              </div>

              <div className="text-left">
                <p className="text-xs md:text-sm text-white/70">
                  Today&apos;s ritual progress
                </p>

                <div className="mt-1 h-1.5 w-40 md:w-56 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400 transition-all"
                    style={{ width: earned ? "100%" : "0%" }}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs md:text-sm text-white/60 text-center md:text-right">
              {earned
                ? "Your ritual is ready. Move through each step at your own pace."
                : "You’ve completed today’s ritual. Return tomorrow to continue your journey."}
            </div>
          </div>
        </section>

        {/* RITUAL EXPERIENCE */}
        <section className="mt-14 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto">
          <BloomReveal
            earned={earned}
            onComplete={handleRitualComplete}
          />
        </section>

      </main>
    </div>
  );
}
