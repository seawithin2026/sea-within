// app/billboard/page.tsx
"use client";

import Image from "next/image";
import { useMemo } from "react";

type LotusMessage = {
  id: number;
  text: string;
  delay: number;
  duration: number;
  startX: number;
  endX: number;
  startY: number;
  endY: number;
};

const lotusMessages: LotusMessage[] = [
  {
    id: 1,
    text: "Your truth is a lantern on the water.",
    delay: 0,
    duration: 38,
    startX: -10,
    endX: 110,
    startY: 65,
    endY: 40,
  },
  {
    id: 2,
    text: "Every word you share becomes light for someone else.",
    delay: 8,
    duration: 42,
    startX: 110,
    endX: -10,
    startY: 55,
    endY: 35,
  },
  {
    id: 3,
    text: "You are not alone in what you carry.",
    delay: 16,
    duration: 40,
    startX: -15,
    endX: 115,
    startY: 75,
    endY: 50,
  },
];

function buildDriftStyle(m: LotusMessage) {
  const keyframes = `
    @keyframes lotus-drift-${m.id} {
      0% {
        transform: translate3d(${m.startX}vw, ${m.startY}vh, 0);
        opacity: 0;
      }
      5% {
        opacity: 1;
      }
      95% {
        opacity: 1;
      }
      100% {
        transform: translate3d(${m.endX}vw, ${m.endY}vh, 0);
        opacity: 0;
      }
    }
  `;
  const animation = `lotus-drift-${m.id} ${m.duration}s linear ${m.delay}s infinite`;
  return { keyframes, animation };
}

export default function BillboardPage() {
  const driftDefs = useMemo(
    () => lotusMessages.map((m) => ({ m, ...buildDriftStyle(m) })),
    []
  );

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-amber-50">
      {/* Dynamic keyframes for each lotus message */}
      <style jsx global>{`
        ${driftDefs.map((d) => d.keyframes).join("\n")}
      `}</style>

      {/* Background: cinematic ocean with golden sanctuary moon */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <Image
          src="/images/cinematic-ocean-sanctuary-moon.jpg"
          alt="Cinematic dark ocean with golden-orange sanctuary moon and lotus"
          fill
          priority
          className="object-cover"
        />
        {/* Subtle vignette + depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/80" />
        {/* Slight horizon mist */}
        <div className="absolute inset-x-0 top-1/3 h-40 bg-gradient-to-b from-amber-100/8 via-transparent to-transparent blur-3xl opacity-70" />
      </div>

      {/* Top navigation + title (kept minimal so image breathes) */}
      <header className="relative z-10 flex flex-col items-center pt-8 px-6">
        <div className="flex w-full max-w-5xl items-center justify-between text-xs tracking-[0.25em] uppercase text-amber-200/80">
          <span className="text-[11px]">SEA WITHIN</span>
          <nav className="hidden gap-6 md:flex text-[11px] text-amber-100/70">
            <button className="hover:text-amber-100/100 transition-colors">
              Sanctuary
            </button>
            <button className="hover:text-amber-100/100 transition-colors">
              Journal
            </button>
            <button className="hover:text-amber-100/100 transition-colors">
              Wisdom Board
            </button>
            <button className="text-amber-100">Wisdom Board Reveal</button>
            <button className="hover:text-amber-100/100 transition-colors">
              Community
            </button>
          </nav>
          <button className="rounded-full border border-amber-300/40 px-4 py-1.5 text-[11px] font-medium text-amber-100/90 bg-black/30 backdrop-blur-sm hover:bg-amber-200/10 transition">
            Join
          </button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-amber-200/70">
            Wisdom Board Reveal
          </p>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-amber-50">
            The Lotus Sanctuary
          </h1>
          <p className="mt-3 max-w-xl text-xs md:text-sm text-amber-100/80 mx-auto">
            Where your shared wisdom becomes awakening light.
          </p>
        </div>
      </header>

      {/* Drifting lotus messages over the ocean */}
      <section className="pointer-events-none relative z-10 mt-10 h-[60vh] w-full">
        {driftDefs.map(({ m, animation }) => (
          <div
            key={m.id}
            className="absolute"
            style={{
              animation,
            }}
          >
            <div className="flex items-center gap-3">
              {/* Lotus glow badge */}
              <div className="relative h-9 w-9">
                <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-xl" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full bg-amber-500/90 shadow-[0_0_25px_rgba(251,191,36,0.75)]">
                  <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-black/80">
                    Lotus
                  </span>
                </div>
              </div>

              {/* Message pill */}
              <div className="max-w-xs rounded-full border border-amber-200/40 bg-black/45 px-4 py-2 text-[11px] text-amber-50/90 backdrop-blur-md shadow-[0_0_30px_rgba(15,23,42,0.9)]">
                {m.text}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Call to action near bottom, still within the scene */}
      <footer className="relative z-10 mt-10 mb-16 flex flex-col items-center px-6">
        <button className="rounded-full border border-amber-300/60 bg-black/40 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-amber-100/90 backdrop-blur-md hover:bg-amber-200/10 transition">
          Write Your Truth in the Sand
        </button>
        <p className="mt-3 text-[11px] text-amber-100/70">
          Your words become lanterns on the water.
        </p>
      </footer>
    </main>
  );
}
