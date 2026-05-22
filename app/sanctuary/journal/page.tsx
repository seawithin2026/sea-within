"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { BloomReveal } from "@/components/bloom/BloomReveal";
import { selectNextBloom } from "@/components/bloom/bloomSelection";

type GardenBloom = {
  id: string;
  bloomVideoId: string;
  level: number;
  stillUrl: string | null;
  createdAt: string;
};

type BloomVideo = {
  id: string;
  src: string;
  title: string;
  level: number;
};

const MOCK_BLOOM_VIDEOS: BloomVideo[] = [
  {
    id: "bloom-01",
    src: "/bloom-videos/bloom-01.mp4",
    title: "First Bloom",
    level: 1,
  },
  {
    id: "bloom-02",
    src: "/bloom-videos/bloom-02.mp4",
    title: "Second Bloom",
    level: 2,
  },
  {
    id: "bloom-03",
    src: "/bloom-videos/bloom-03.mp4",
    title: "Third Bloom",
    level: 3,
  },
];

export default function BloomJournalPage() {
  // In your real logic, this comes from the ritual engine:
  // true only when today’s cycle is complete.
  const [earned, setEarned] = useState<boolean>(true);

  // Current bloom video for this cycle
  const [currentBloomVideo, setCurrentBloomVideo] = useState<BloomVideo | null>(
    MOCK_BLOOM_VIDEOS[0]
  );

  // Garden blooms (saved blooms from DB)
  const [garden, setGarden] = useState<GardenBloom[]>([]);
  const [loadingGarden, setLoadingGarden] = useState<boolean>(true);

  useEffect(() => {
    fetchGarden();
  }, []);
  // SELECT NEXT BLOOM AFTER GARDEN LOADS
useEffect(() => {
  if (loadingGarden) return;
  if (!garden) return;

  const userLevel = 2;
  const usedBloomIds = garden.map((b) => b.bloomVideoId);

  const rawBloom = selectNextBloom(usedBloomIds, userLevel);

  if (!rawBloom) {
    console.error("Bloom selection returned undefined");
    return;
  }

  // NORMALIZE bloom into the UI format
  const nextBloom: BloomVideo = {
    id: rawBloom.id,
    src: rawBloom.src,
    title: rawBloom.id.replace("bloom-", "Bloom "), // temporary title
    level: rawBloom.baseLevel,
  };

  setCurrentBloomVideo(nextBloom);
}, [loadingGarden, garden]);



  async function fetchGarden() {
    try {
      setLoadingGarden(true);

      // TODO: replace with real GET /api/blooms or Supabase query
      // For now, this is a placeholder so the UI is wired correctly.
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

  function handleBloomSaved(bloomVideoId: string) {
    // After a bloom is saved:
    // - refresh garden
    // - mark this cycle as complete
    // - optionally pick the next bloom video for the next cycle
    fetchGarden();
    setEarned(false);

    // Example: rotate to next mock bloom for next cycle
    const currentIndex = MOCK_BLOOM_VIDEOS.findIndex((b) => b.id === bloomVideoId);
    const nextIndex = (currentIndex + 1) % MOCK_BLOOM_VIDEOS.length;
    setCurrentBloomVideo(MOCK_BLOOM_VIDEOS[nextIndex]);
  }

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
              {garden.map((bloom) => (
                <button
                  key={bloom.id}
                  type="button"
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 aspect-[3/4] shadow-[0_0_30px_rgba(0,0,0,0.6)]"
                >
                  {/* Bloom still */}
                  {bloom.stillUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
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
