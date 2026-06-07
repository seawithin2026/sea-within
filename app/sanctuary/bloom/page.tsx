"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";

// 🌿 GESTURE LIBRARY — simple, nourishing suggestions
const GESTURES = [
  "Take a warm shower and feel the water on your skin for one slow breath.",
  "Drink a glass of water and notice the coolness moving through you.",
  "Step outside and let the air touch your face for a moment.",
  "Place your hand on your heart and feel one rise and fall.",
  "Hold a warm mug and feel the heat settle into your palms.",
  "Look toward a window and let your eyes rest on the light.",
  "Stretch your arms gently overhead and feel your body lengthen.",
  "Splash cool water on your face and let it wake your senses.",
  "Wrap yourself in a blanket and feel the weight settle around you.",
  "Close your eyes and listen for the quietest sound in the room.",
  "Sit down and let your shoulders soften for one slow breath.",
  "Touch your forearm gently and notice the warmth of your own skin.",
  "Stand still for a moment and feel the ground supporting you.",
  "Light a candle and watch the flame for a few seconds.",
  "Rest your back against a surface and feel it hold you.",
  "Take one slow inhale and let it land softly inside you.",
  "Gently roll your shoulders and notice where they soften.",
  "Look at something beautiful and let your eyes rest there.",
  "Place both feet flat on the floor and feel their weight.",
  "Sit quietly and notice the rhythm of your breathing.",
  "Take a slow breath and feel your chest open just a little more than usual.",
  "Place your hand on your collarbone and feel the gentle rise beneath your touch.",
  "Stand tall for a moment and feel your whole body wake up.",
  "Let your fingertips trace your jawline and feel the warmth of your skin.",
  "Sit quietly and feel your breath deepen naturally.",
  "Place your palm over your heart and notice the quiet strength there.",
  "Let your shoulders roll back and feel the space it creates inside you.",
  "Rest your hand on your belly and feel the calm settling there.",
  "Lift your face slightly and feel the air move across your skin.",
  "Let your hands press gently together and feel the connection.",
  "Take a slow inhale and feel your ribs expand like a quiet opening.",
  "Place your hand on the side of your neck and feel the warmth of your pulse.",
  "Let your spine lengthen and feel the energy rise through your body.",
  "Rest your hand on your chest and feel the softness beneath your palm.",
  "Let your breath fill your lower belly and feel the grounding.",
  "Place your fingertips on your temples and feel the tension melt.",
  "Sit still and feel your breath move all the way down your body.",
  "Let your eyes soften and feel the calm behind them.",
  "Place your hand on your shoulder and feel the warmth spread.",
  "Take a slow breath and feel your whole body respond with ease.",
  "Let your hands rest over your heart and feel the quiet inside you.",
  "Sit tall and feel the strength in your spine.",
  "Let your breath move gently through your chest and soften the space there.",
  "Place your hand on your lower ribs and feel them expand with your breath.",
  "Let your fingers rest lightly on your throat and feel the subtle movement.",
  "Sit still and feel your breath warm the inside of your body.",
  "Let your shoulders soften and feel the release ripple downward.",
  "Place your hand on your upper arm and feel the comfort of your own touch.",
  "Take a slow inhale and feel your body wake up from the inside.",
  "Let your breath deepen and feel a quiet spark rise within you.",

];

// 🌸 BLOOM LIBRARY — cinematic flower videos
const BLOOMS = [
  "/bloom-videos/bloom-01.mp4",
  "/bloom-videos/bloom-02.mp4",
  "/bloom-videos/bloom-03.mp4",
  "/bloom-videos/bloom-04.mp4",
  "/bloom-videos/bloom-05.mp4",
  "/bloom-videos/bloom-06.mp4",
  "/bloom-videos/bloom-07.mp4",
  "/bloom-videos/bloom-08.mp4",
  "/bloom-videos/bloom-09.mp4",
  "/bloom-videos/bloom-10.mp4",
  "/bloom-videos/bloom-11.mp4",
  "/bloom-videos/bloom-12.mp4",
  "/bloom-videos/bloom-13.mp4",
  "/bloom-videos/bloom-14.mp4",
];

const STORAGE_KEY_USED_GESTURES = "seaWithin.usedGestures";
const STORAGE_KEY_USED_BLOOMS = "seaWithin.usedBlooms";

function getRandomUnusedIndex(total: number, used: number[]): number {
  const allIndices = Array.from({ length: total }, (_, i) => i);
  const available = allIndices.filter((i) => !used.includes(i));

  // if all used, reset
  if (available.length === 0) {
    return Math.floor(Math.random() * total);
  }

  const randomIndex = available[Math.floor(Math.random() * available.length)];
  return randomIndex;
}

function loadUsedIndices(key: string): number[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function saveUsedIndices(key: string, used: number[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(used));
}

export default function BloomRitualPage() {
  const [gestureIndex, setGestureIndex] = useState<number | null>(null);
  const [bloomIndex, setBloomIndex] = useState<number | null>(null);
  const [showBloom, setShowBloom] = useState(false);

  // load or choose gesture + bloom on first render
  useEffect(() => {
    const usedGestures = loadUsedIndices(STORAGE_KEY_USED_GESTURES);
    const usedBlooms = loadUsedIndices(STORAGE_KEY_USED_BLOOMS);

    const gIndex = getRandomUnusedIndex(GESTURES.length, usedGestures);
    const bIndex = getRandomUnusedIndex(BLOOMS.length, usedBlooms);

    setGestureIndex(gIndex);
    setBloomIndex(bIndex);

    // update used lists (non‑repeating until exhausted)
    const newUsedGestures =
      usedGestures.length >= GESTURES.length ? [gIndex] : [...usedGestures, gIndex];
    const newUsedBlooms =
      usedBlooms.length >= BLOOMS.length ? [bIndex] : [...usedBlooms, bIndex];

    saveUsedIndices(STORAGE_KEY_USED_GESTURES, newUsedGestures);
    saveUsedIndices(STORAGE_KEY_USED_BLOOMS, newUsedBlooms);
  }, []);

  function handleAcknowledge() {
    // user says: “I offered myself a moment”
    setShowBloom(true);
  }

  function handleCloseBloom() {
    setShowBloom(false);
  }

  const gestureText =
    gestureIndex !== null ? GESTURES[gestureIndex] : "Offer yourself one small moment of softness.";

  const bloomSrc =
    bloomIndex !== null ? BLOOMS[bloomIndex] : "/bloom-videos/bloom-01.mp4";

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20 pb-16 flex flex-col items-center">
        {/* HERO */}
        <section className="mt-16 px-6 md:px-10 lg:px-16 max-w-3xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-white/40">
            Sanctuary • Bloom Ritual
          </p>

          <h1 className="mt-3 text-3xl md:text-4xl tracking-[0.16em] uppercase text-white/90">
            Your Bloom Ritual
          </h1>

          <p className="mt-4 text-sm md:text-base text-white/60">
            One simple act of nourishment.  
            One Bloom rising from your inner ocean.
          </p>
        </section>

        {/* GESTURE + ACKNOWLEDGE */}
        <section className="mt-12 w-full px-6 md:px-10 lg:px-16 max-w-3xl mx-auto">
          <div className="rounded-3xl border border-white/10 bg-black/40 px-6 py-8 shadow-[0_0_30px_rgba(0,0,0,0.7)] backdrop-blur-md flex flex-col items-center gap-6">
            <p className="uppercase text-[11px] tracking-[0.22em] text-white/40">
              Today’s Moment of Nourishment
            </p>

            <p className="text-sm md:text-base text-white/75 text-center max-w-xl">
              {gestureText}
            </p>

            <button
              onClick={handleAcknowledge}
              className="
                mt-4 px-8 py-3 rounded-full 
                text-[11px] tracking-[0.22em] uppercase
                bg-gradient-to-r from-emerald-300 via-amber-200 to-rose-300
                text-black shadow-[0_0_25px_rgba(255,255,255,0.35)]
                hover:opacity-90 transition-all
              "
            >
              I offered myself a moment
            </button>

            <p className="text-[11px] text-white/40 tracking-[0.22em] uppercase mt-2 text-center">
              When you feel ready, let this Bloom rise for you.
            </p>
          </div>
        </section>

        {/* BLOOM REVEAL MODAL */}
        {showBloom && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-xl">
            <div className="relative max-w-xl w-full mx-6 rounded-3xl border border-white/15 bg-[rgba(5,7,11,0.95)] shadow-[0_0_60px_rgba(0,0,0,0.9)] px-6 py-8 flex flex-col items-center gap-6">
              <p className="uppercase text-[11px] tracking-[0.22em] text-white/40">
                Your Bloom
              </p>

              <div className="w-full aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <video
                  key={bloomSrc}
                  src={bloomSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-sm md:text-base text-white/75 text-center max-w-md">
                This Bloom rose from the kindness you offered yourself.
              </p>

              <button
                onClick={handleCloseBloom}
                className="
                  mt-2 px-6 py-2 rounded-full 
                  text-[11px] tracking-[0.22em] uppercase
                  border border-white/30 text-white/80
                  hover:bg-white/10 transition-all
                "
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
