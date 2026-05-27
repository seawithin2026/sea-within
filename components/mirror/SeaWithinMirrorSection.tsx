"use client";

import React from "react";

type SeaWithinMirrorProps = {
  mediaSrc: string;
  promptText: string;
  onPlantSeed?: () => void;
  onTendPlant?: () => void;     // ⭐ NEW
  seedPlantedToday: boolean;
  step?: number;                // ⭐ NEW
};

export function SeaWithinMirrorSection({
  mediaSrc,
  promptText,
  onPlantSeed,
  onTendPlant,       // ⭐ NEW
  seedPlantedToday,
  step = 0,          // ⭐ DEFAULT
}: SeaWithinMirrorProps) {
  const isVideo = mediaSrc.endsWith(".mp4");

  return (
    <section className="mt-14 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 items-center">

        {/* LEFT: Sea Within Mirror */}
        <div className="relative flex items-center justify-center">

          {/* Soft ambient glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(251,191,36,0.16),_transparent_55%)] blur-3xl" />

          {/* Pedestal */}
          <div className="absolute bottom-0 w-64 h-6 rounded-full bg-gradient-to-r from-emerald-500/25 via-amber-300/25 to-rose-400/25 blur-xl opacity-70" />

          {/* Mirror frame */}
          <div className="relative w-full max-w-sm aspect-[3/5] rounded-[2.5rem] bg-gradient-to-b from-slate-900/90 via-slate-950 to-black border border-[rgba(255,255,255,0.16)] shadow-[0_0_70px_rgba(0,0,0,0.95)] overflow-hidden backdrop-blur-2xl">

            {/* Golden mandala glow */}
            <div className="pointer-events-none absolute -inset-[1px] bg-[radial-gradient(circle_at_center,_rgba(250,204,21,0.18),_transparent_60%)]" />

            {/* Inner rim */}
            <div className="absolute inset-[10px] rounded-[2rem] border border-[rgba(250,204,21,0.45)]/80 shadow-[0_0_30px_rgba(250,204,21,0.35)]" />

            {/* Mirror glass */}
            <div className="absolute inset-[14px] rounded-[1.8rem] bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.16),_transparent_55%),_linear-gradient(to_bottom,_rgba(15,23,42,0.9),_rgba(3,7,18,0.98))]" />

            {/* MEDIA */}
            {isVideo ? (
              <video
                src={mediaSrc}
                muted
                playsInline
                autoPlay
                loop
                className="relative z-10 inset-[18px] absolute w-[calc(100%-36px)] h-[calc(100%-36px)] object-cover rounded-[1.6rem]
                           brightness-[1.25] contrast-[1.18] saturate-[1.35] hue-rotate-[8deg]
                           drop-shadow-[0_0_22px_rgba(0,255,195,0.45)]
                           drop-shadow-[0_0_38px_rgba(0,180,255,0.25)]
                           drop-shadow-[0_0_65px_rgba(0,120,255,0.18)]"
              />
            ) : (
              <img
                src={mediaSrc}
                alt="Ritual step"
                className="relative z-10 inset-[18px] absolute w-[calc(100%-36px)] h-[calc(100%-36px)] object-cover rounded-[1.6rem]
                           brightness-[1.25] contrast-[1.18] saturate-[1.35] hue-rotate-[8deg]
                           drop-shadow-[0_0_22px_rgba(0,255,195,0.45)]
                           drop-shadow-[0_0_38px_rgba(0,180,255,0.25)]
                           drop-shadow-[0_0_65px_rgba(0,120,255,0.18)]"
              />
            )}

            {/* Highlight */}
            <div className="pointer-events-none absolute inset-x-10 top-4 h-16 rounded-full bg-white/10 blur-xl opacity-60" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-7">

          {/* Text */}
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

            {/* PLANT SEED BUTTON */}
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
              onClick={onTendPlant}
              className="mt-4 inline-flex items-center justify-center rounded-full px-6 py-3 text-[11px] tracking-[0.22em] uppercase
                         bg-gradient-to-r from-emerald-400/20 via-amber-300/20 to-rose-400/20
                         text-amber-100 border border-amber-300/40 shadow-[0_0_25px_rgba(250,204,21,0.25)]
                         hover:from-emerald-400/30 hover:to-rose-400/30 transition-all"
            >
              Tend to your bloom
            </button>
          )}

        </div>
      </div>
    </section>
  );
}
