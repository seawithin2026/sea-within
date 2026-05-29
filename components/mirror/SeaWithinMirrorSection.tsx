"use client";

import React from "react";

type SeaWithinMirrorProps = {
  mediaSrc: string;
  promptText: string;
  onPlantSeed?: () => void;
  onTendPlant?: () => void;
  onStartNewCycle?: () => void; // NEW
  seedPlantedToday: boolean;
  step?: number;
  hasTendedToday?: boolean;
};

export function SeaWithinMirrorSection({
  mediaSrc,
  promptText,
  onPlantSeed,
  onTendPlant,
  onStartNewCycle,
  seedPlantedToday,
  step = 0,
  hasTendedToday = false,
}: SeaWithinMirrorProps) {
  const isVideo = mediaSrc.endsWith(".mp4");

  // 🌱 START MODE
  const isStartMode = step === 0;

  // 🌿 RITUAL MODE
  const isRitualMode = step > 0 && step < 25;

  // 🌸 FINAL BLOOM MODE
  const isFinalBloom = step === 25;

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
          min-h-[85vh]
        "
      >

        {/* LEFT SIDE — CINEMATIC WINDOW */}
        <div className="w-[95%] md:w-full h-[85vh] aspect-video mx-auto rounded-2xl bg-black overflow-hidden flex items-center justify-center">
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

        {/* RIGHT SIDE — MODE-BASED UI */}
        <div className="space-y-7 flex flex-col justify-center py-10">

          {/* 🌱 START MODE UI */}
          {isStartMode && (
            <>
              <div className="space-y-3">
                <p className="text-[11px] tracking-[0.28em] uppercase text-white/35">
                  Sea Within • Ritual
                </p>

                <h2 className="text-2xl md:text-[1.9rem] tracking-[0.16em] uppercase text-white/90">
                  Begin Your Inner Bloom
                </h2>

                <p className="text-sm md:text-[0.95rem] text-white/65">
                  When you plant your seed, your ritual begins.
                </p>
              </div>

              <button
                type="button"
                onClick={onPlantSeed}
                className="
                  inline-flex items-center justify-center rounded-full px-6 py-3
                  text-[11px] tracking-[0.22em] uppercase
                  border border-amber-300/70
                  bg-gradient-to-r from-amber-300/20 via-emerald-300/15 to-sky-300/20
                  text-amber-100 shadow-[0_0_25px_rgba(250,204,21,0.35)]
                  hover:from-amber-300/30 hover:to-sky-300/30
                  transition-all
                "
              >
                Plant Your Seed
              </button>
            </>
          )}

          {/* 🌿 RITUAL MODE UI */}
          {isRitualMode && (
            <>
              <div className="space-y-3">
                <p className="text-[11px] tracking-[0.28em] uppercase text-white/35">
                  Sea Within • Ritual
                </p>

                <h2 className="text-2xl md:text-[1.9rem] tracking-[0.16em] uppercase text-white/90">
                  Your Inner Flower Evolves With You
                </h2>

                <p className="text-sm md:text-[0.95rem] text-white/65">
                  Today’s Seed Prompt
                </p>

                <p className="text-sm md:text-[0.95rem] text-white/75">
                  {promptText}
                </p>
              </div>

              <button
                type="button"
                onClick={hasTendedToday ? undefined : onTendPlant}
                disabled={hasTendedToday}
                className={`
                  inline-flex items-center justify-center rounded-full px-6 py-3
                  text-[11px] tracking-[0.22em] uppercase transition-all
                  ${
                    hasTendedToday
                      ? "border border-white/20 bg-white/5 text-white/30 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-400/20 via-amber-300/20 to-rose-400/20 text-amber-100 border border-amber-300/40 shadow-[0_0_25px_rgba(250,204,21,0.25)] hover:from-emerald-400/30 hover:to-rose-400/30"
                  }
                `}
              >
                {hasTendedToday ? "Prompt Completed Today" : "Tend to Your Bloom"}
              </button>
            </>
          )}

     {/* 🌿 RITUAL MODE UI */}
{isRitualMode && (
  <>
    <div className="space-y-3">
      <p className="text-[11px] tracking-[0.28em] uppercase text-white/35">
        Sea Within • Ritual
      </p>

      <h2 className="text-2xl md:text-[1.9rem] tracking-[0.16em] uppercase text-white/90">
        Your Inner Flower Evolves With You
      </h2>

      {/* ✨ YOUR METAPHOR TEXT — restored */}
      <p className="text-sm md:text-[0.95rem] leading-relaxed text-white/65">
        Inside you lives a flower that grows only through care — a quiet
        reflection of your inner world. Each small act of tending nourishes
        something real within you.
      </p>

      <p className="text-[11px] tracking-[0.22em] uppercase text-white/40 mt-4">
        Today’s Seed Prompt
      </p>

      <p className="text-sm md:text-[0.95rem] text-white/75">
        {promptText}
      </p>
    </div>

    <button
      type="button"
      onClick={hasTendedToday ? undefined : onTendPlant}
      disabled={hasTendedToday}
      className={`
        inline-flex items-center justify-center rounded-full px-6 py-3
        text-[11px] tracking-[0.22em] uppercase transition-all
        ${
          hasTendedToday
            ? "border border-white/20 bg-white/5 text-white/30 cursor-not-allowed"
            : "bg-gradient-to-r from-emerald-400/20 via-amber-300/20 to-rose-400/20 text-amber-100 border border-amber-300/40 shadow-[0_0_25px_rgba(250,204,21,0.25)] hover:from-emerald-400/30 hover:to-rose-400/30"
        }
      `}
    >
      {hasTendedToday ? "Prompt Completed Today" : "Tend to Your Bloom"}
    </button>
  </>
)}


        </div>
      </div>
    </section>
  );
}
