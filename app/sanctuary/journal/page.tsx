"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { BloomReveal } from "@/components/bloom/BloomReveal";
import { selectNextBloom } from "@/components/bloom/bloomSelection";
import { getBloomVideos } from "@/lib/blooms/getBloomVideos";
import { evolveAura } from "@/lib/blooms/auraEvolution";
import { BloomVideo } from "@/lib/blooms/types";


// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------


type UIBloomVideo = {
  id: string;
  src: string;
  title: string;
  level: number;
  element: string;   // ⭐ ADD THIS
};


// Garden bloom from your API
type GardenBloom = {
  id: string;
  bloomVideoId: string;
  level: number;
  element: string;   // ⭐ ADD THIS
  stillUrl: string | null;
  createdAt: string;
};



export default function BloomJournalPage() {
  const [earned, setEarned] = useState<boolean>(true);

  const [currentBloomVideo, setCurrentBloomVideo] = useState<UIBloomVideo | null>(null);

  const [garden, setGarden] = useState<GardenBloom[]>([]);
  const [loadingGarden, setLoadingGarden] = useState<boolean>(true);

  const [bloomLibrary, setBloomLibrary] = useState<BloomVideo[]>([]);

  // ------------------------------------------------------------
  // LOAD BLOOM LIBRARY + GARDEN ON MOUNT
  // ------------------------------------------------------------
  useEffect(() => {
    loadBloomLibrary();
    fetchGarden();
  }, []);

  async function loadBloomLibrary() {
  const blooms = await getBloomVideos();
  setBloomLibrary(blooms as BloomVideo[]);
}

  // ------------------------------------------------------------
  // SELECT NEXT BLOOM AFTER BOTH LIBRARY + GARDEN ARE READY
  // ------------------------------------------------------------
  useEffect(() => {
    if (loadingGarden) return;
    if (!bloomLibrary.length) return;

    const userLevel = 2;
    const usedBloomIds = garden.map((b) => b.bloomVideoId);

    const rawBloom = selectNextBloom(bloomLibrary, usedBloomIds, userLevel);
    if (!rawBloom) return;

   const nextBloom: UIBloomVideo = {
  id: rawBloom.id,
  src: rawBloom.src,
  title: rawBloom.title ?? rawBloom.id.replace("bloom-", "Bloom "),
  level: rawBloom.base_level,
  element: rawBloom.element,   // ⭐ REQUIRED
};


    setCurrentBloomVideo(nextBloom);
  }, [loadingGarden, bloomLibrary, garden]);

  // ------------------------------------------------------------
  // FETCH GARDEN FROM API
  // ------------------------------------------------------------
  async function fetchGarden() {
    try {
      setLoadingGarden(true);

      const res = await fetch("/api/blooms", { method: "GET" }).catch(() => null);

      if (res && res.ok) {
        const json = await res.json();
        setGarden(json.blooms ?? []);
      } else {
        setGarden([]);
      }
    } catch {
      setGarden([]);
    } finally {
      setLoadingGarden(false);
    }
  }

  // ------------------------------------------------------------
  // AFTER BLOOM IS SAVED
  // ------------------------------------------------------------
  function handleBloomSaved() {
    fetchGarden();
    setEarned(false);
  }
// Apply aura evolution to each bloom before rendering
const gardenWithAura = garden.map((b) => {
 const { auraClass } = evolveAura(b.level, b.element);
return { ...b, auraClass };
});

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20 pb-16">
        {/* HERO */}
        <section className="px-6 md:px-10 lg:px-16 max-w-6xl mx-auto text-center md:text-left">
          <p className="text-[11px] tracking-[0.28em] uppercase text-white/40">
            Sanctuary • Bloom Journal
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl lg:text-[2.8rem] tracking-[0.16em] uppercase text-white/90">
            Your Growing Garden of Self‑Care
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base text-white/60 mx-auto md:mx-0">
            Every time you complete your ritual, a new bloom unfolds. Over time, your journal
            becomes a living garden of moments where you chose to care for yourself.
          </p>
        </section>

        {/* SEED / PROGRESS STRIP */}
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
                    style={{ width: earned ? "100%" : "45%" }}
                  />
                </div>
              </div>
            </div>
            <div className="text-xs md:text-sm text-white/60 text-center md:text-right">
              {earned
                ? "You’ve reached the flowering stage. Your next bloom is ready to unfold."
                : "Keep returning to your ritual. When the seed is ready, a new bloom will appear."}
            </div>
          </div>
        </section>

        {/* BLOOM REVEAL SECTION */}
        <section className="mt-10 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 items-center">
            <div className="order-2 lg:order-1">
              {currentBloomVideo && (
                <BloomReveal
                  earned={earned}
                  bloomVideo={currentBloomVideo}
                  onSaved={handleBloomSaved}
                />
              )}
            </div>

            <div className="order-1 lg:order-2 flex flex-col gap-4">
              <h2 className="text-sm tracking-[0.22em] uppercase text-white/60">
                The Bloom Ritual
              </h2>
              <p className="text-sm md:text-base text-white/70">
                When you complete your cycle, a short cinematic flower unfolds just for you. Each
                bloom is different—color, glow, aura, and motion—so your garden becomes a visual
                diary of your devotion to yourself.
              </p>
              <ul className="mt-2 space-y-2 text-sm text-white/60">
                <li>• Every earned bloom unlocks a unique unfolding video.</li>
                <li>• After the video, a still frame is saved into your garden.</li>
                <li>• Over time, your blooms form a growing constellation of accomplishments.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* GARDEN GRID */}
        <section className="mt-14 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-sm tracking-[0.22em] uppercase text-white/60">
                Your Bloom Garden
              </h2>
              <p className="mt-1 text-xs md:text-sm text-white/50">
                Every flower here is a moment you chose to nourish yourself.
              </p>
            </div>
            <div className="text-xs text-white/40">
              {garden.length > 0 ? `${garden.length} blooms` : "No blooms yet"}
            </div>
          </div>

          {loadingGarden ? (
            <p className="text-center text-white/40 text-sm py-10">
              Gathering your blooms from the deep…
            </p>
          ) : garden.length === 0 ? (
            <div className="py-10 text-center text-white/45 text-sm">
              Your garden is waiting for its first bloom.  
              Complete a ritual cycle to unlock your first flower.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
             {gardenWithAura.map((bloom) => (
  <button
    key={bloom.id}
    type="button"
    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 aspect-[3/4] shadow-[0_0_30px_rgba(0,0,0,0.6)] ${bloom.auraClass}`}
  >
    {/* Bloom still */}
    {bloom.stillUrl ? (
      <img
        src={bloom.stillUrl}
        alt="Bloom still"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    ) : (
      <div className="h-full w-full bg-gradient-to-br from-emerald-500/30 via-sky-500/20 to-slate-900" />
    )}

    {/* Aura overlay */}
    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-radial-at-center from-amber-300/35 via-rose-400/15 to-transparent" />

    {/* Meta strip */}
    <div className="absolute bottom-0 inset-x-0 px-3 pb-3 pt-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
      <p className="text-[10px] tracking-[0.22em] uppercase text-white/70">
        Bloom #{bloom.id.slice(-4)}
      </p>
      <p className="mt-1 text-[11px] text-white/55">
        Level {bloom.level} •{" "}
        {new Date(bloom.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  </button>
))}

            </div>
          )}
        </section>
      </main>
    </div>
  );
}
