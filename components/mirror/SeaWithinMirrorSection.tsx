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
    <section className="px-6 md:px-10 lg:px-16 w-full">
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)]
          gap-12
          items-stretch
          w-full
          min-h-[85vh]        /* ← slightly less tall */
        "
      >

      {/* LEFT SIDE — FINAL, STABLE, UNCROPPED CINEMATIC WINDOW */}
<div className="w-[95%] md:w-full h-[85vh] mx-auto rounded-2xl overflow-hidden bg-black flex items-center justify-center">
  {isVideo ? (
    <video
      src={mediaSrc}
      autoPlay
      loop
      muted
      playsInline
      className="max-w-full max-h-full object-contain"
    />
  ) : (
    <img
      src={mediaSrc}
      alt="Ritual step"
      className="max-w-full max-h-full object-contain"
    />
  )}
</div>


        {/* RIGHT SIDE — TEXT + BUTTONS */}
        <div className="space-y-7 flex flex-col justify-center py-10">
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.28em] uppercase text-white/35">
              Sea Within • Ritual
            </p>

            <h2 className="text-2xl md:text-[1.9rem] tracking-[0.16em] uppercase text-white/90">
              Your Inner Flower Evolves With You
            </h2>

            <p className="text-sm md:text-[0.95rem] leading-relaxed text-white/65">
              Inside you lives a flower that grows only through care.
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
