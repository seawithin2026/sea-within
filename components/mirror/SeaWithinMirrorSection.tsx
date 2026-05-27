"use client";

import React from "react";

type SeaWithinMirrorProps = {
  mediaSrc: string;
  promptText: string;
  onPlantSeed?: () => void;
  onTendPlant?: () => void;
  seedPlantedToday: boolean;
  step?: number;
  hasTendedToday?: boolean;
};

export function SeaWithinMirrorSection({
  mediaSrc,
  promptText,
  onPlantSeed,
  onTendPlant,
  seedPlantedToday,
  step = 0,
  hasTendedToday = false,
}: SeaWithinMirrorProps) {
  const isVideo = mediaSrc.endsWith(".mp4");

  return (
    <section className="mt-14 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 items-center">

        {/* LEFT: Sea Within Mirror */}
        <div className="relative flex items-center justify-center">

          {/* Ambient glow behind mirror */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,128,0.22),_transparent_70%)] blur-3xl" />

          {/* Soft grounding glow */}
          <div className="absolute bottom-0 w-72 h-8 rounded-full bg-gradient-to-r from-amber-300/25 via-rose-300/25 to-emerald-300/25 blur-xl opacity-70" />

          {/* MIRROR FRAME */}
          <div className="relative w-full max-w-sm aspect-[3/5] rounded-[3rem] overflow-hidden">

            {/* Outer ornate gold frame */}
            <div className="absolute inset-0 rounded-[3rem] border-[6px] border-amber-300/70 shadow-[0_0_45px_rgba(255,200,80,0.45)] 
                            bg-[radial-gradient(circle_at_top,_rgba(255,240,200,0.25),_transparent_70%),_linear-gradient(to_bottom,_rgba(80,60,20,0.45),_rgba(40,30,10,0.55))]" />

            {/* Inner glowing rim */}
            <div className="absolute inset-[10px] rounded-[2.6rem] border-[3px] border-amber-200/60 shadow-[0_0_35px_rgba(255,220,150,0.45)]" />

            {/* Soft inner halo */}
            <div className="absolute inset-[18px] rounded-[2.2rem] bg-[radial-gradient(circle_at_center,_rgba(255,230,180,0.12),_transparent_65%)]" />

            {/* MEDIA CONTENT */}
            {isVideo ? (
              <video
                src={mediaSrc}
                muted
                playsInline
                autoPlay
                loop
                className="absolute inset-[26px] w-[calc(100%-52px)] h-[calc(100%-52px)] object-cover rounded-[2rem]
                           brightness-[1.22] contrast-[1.15] saturate-[1.28]"
              />
            ) : (
              <img
                src={mediaSrc}
                alt="Ritual step"
                className="absolute inset-[26px] w-[calc(100%-52px)] h-[calc(100%-52px)] object-cover rounded-[2rem]
                           brightness-[1.22] contrast-[1.15] saturate-[1.28]"
              />
            )}

            {/* Top soft glow */}
            <div className="pointer-events-none absolute inset-x-12 top-6 h-20 rounded-full bg-amber-100/10 blur-xl opacity-70" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-7">
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.28em] uppercase text-white/35">
              Sea Within • Mirror Ritual
            </p>

            <h2 className="text-2xl md:text-[1.9rem] tracking-[0.16em] uppercase text-white/90">
              Your Inner Flower Evolves With You
            </h2>

            <p className="text-sm md:text-[0.95rem] leading-relaxed text-white/65">
              Inside you lives a flower that grows only through care. It changes
              shape as you change, opens when you open, and rests when you rest.
              This mirror is a metaphor for that inner bloom—a reminder that
              your growth responds to your devotion.
            </p>

            <p className="text-sm md:text-[0.95rem] leading-relaxed text-white/65">
              Today, you begin with a single seed.
            </p>
          </div>

          {/* Seed activation */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/3 px-5 py-4 backdrop-blur-xl">
            <p className="text-[11px] tracking-[0.22em] uppercase text-amber-200/80">
              Seed Activation
            </p>

            <p className="text-sm text-white/70">
              Rub your hands together gently, warming the energy of your seed.
              When you feel ready, plant it into the soil of your day.
            </p>

            <button
              type="button"
              onClick={seedPlantedToday ? undefined : onPlantSeed}
              disabled={seedPlantedToday}
              className={`mt-2 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase transition-all duration-300
                ${
                  seedPlantedToday
                    ? "border border-white/20 bg-white/5 text-white/30 cursor-not-allowed backdrop-blur-sm"
                    : "border border-amber-300/70 bg-gradient-to-r from-amber-300/20 via-emerald-300/15 to-sky-300/20 text-amber-100 shadow-[0_0_25px_rgba(250,204,21,0.35)] hover:from-amber-300/30 hover:to-sky-300/30"
                }
              `}
            >
              {seedPlantedToday
                ? "Tend to your inner bloom"
                : "Plant your new seed now"}
            </button>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <p className="text-[11px] tracking-[0.22em] uppercase text-white/40">
              Today&apos;s Seed Prompt
            </p>
            <p className="text-sm md:text-[0.95rem] text-white/75">
              {promptText}
            </p>
          </div>

          {/* DAILY TENDING BUTTON */}
          {seedPlantedToday && step > 0 && step < 25 && (
            <button
              type="button"
              onClick={hasTendedToday ? undefined : onTendPlant}
              disabled={hasTendedToday}
              className={`mt-4 inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] tracking-[0.22em] uppercase transition-all
                ${
                  hasTendedToday
                    ? "border border-white/20 bg-white/5 text-white/30 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-400/20 via-amber-300/20 to-rose-400/20 text-amber-100 border border-amber-300/40 shadow-[0_0_25px_rgba(250,204,21,0.25)] hover:from-emerald-400/30 hover:to-rose-400/30"
                }
              `}
            >
              {hasTendedToday ? "Prompt completed for today" : "Tend to your bloom"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
