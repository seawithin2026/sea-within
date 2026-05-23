"use client";

import { ProceduralFlower } from "../components/ProceduralFlower";

export default function DashboardPage() {
  const seedLevel = 4; // fake for now
  const element: "water" | "fire" | "earth" | "air" = "water";

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10 flex flex-col gap-10">
      {/* Seed / current bloom */}
      <section className="bg-black/30 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <h2 className="text-sm tracking-[0.25em] uppercase text-white/60 mb-3">
            Your Current Bloom
          </h2>
          <p className="text-xl text-white/90 mb-2">
            Level {seedLevel} • {element.toUpperCase()}
          </p>
          <p className="text-white/60 text-sm max-w-md">
            Every visit waters your inner garden. Your flower grows quietly in
            the background — new petals, deeper glow, rare traits unfolding over
            time.
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <ProceduralFlower level={seedLevel} element={element} />
        </div>
      </section>
    </main>
  );
}
