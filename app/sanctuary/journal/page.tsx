"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { SeaWithinMirrorSection } from "@/components/mirror/SeaWithinMirrorSection";

// -----------------------------
// RITUAL MEDIA (25 steps)
// -----------------------------
const RITUAL_STEPS = [
  "/ritual/1-placing-seed.png",
  "/ritual/2-water-seed.png",
  "/ritual/3-air-seed.png",
  "/ritual/4-sun-seed.png",
  "/ritual/5-glowing-seed.mp4",
  "/ritual/6-seed-opening.png",
  "/ritual/7-growing-sprout.mp4",
  "/ritual/8-sprout.png",
  "/ritual/9-water-sprout.png",
  "/ritual/10-sun-sprout.png",
  "/ritual/11-glowing-veins.mp4",
  "/ritual/12-sun-veins.png",
  "/ritual/13-water-veins.png",
  "/ritual/14-growing-veins.png",
  "/ritual/15-water-bud.png",
  "/ritual/16-water-bud.png",
  "/ritual/17-air-bud.png",
  "/ritual/18-sun-bud.png",
  "/ritual/19-bud-opening.png",
  "/ritual/20-bud-bloom.png",
  "/ritual/21-full-bloom.mp4",
  "/ritual/22-bloom.png",
  "/ritual/23-sun-bloom.png",
  "/ritual/24-flower-upgrade.png",
  "/ritual/25-flower-movement.mp4",
];

const TOTAL_STEPS = RITUAL_STEPS.length;

// -----------------------------
// PROMPTS
// -----------------------------
const PROMPTS = [
  "Drink a full glass of water slowly, noticing how your body receives it.",
  "Take three slow breaths and place a hand on your heart.",
  "Choose one small act of kindness for yourself today.",
];

// -----------------------------
// STORAGE KEYS
// -----------------------------
const STORAGE_KEY_DATE = "seaWithin.seedDate";
const STORAGE_KEY_STEP = "seaWithin.ritualStep";

export default function BloomJournalPage() {
  const [step, setStep] = useState(0); // 0 = not started, 1..25 = ritual steps
  const [promptIndex] = useState(0);
  const [seedPlantedToday, setSeedPlantedToday] = useState(false);
  const [hasPlanted, setHasPlanted] = useState(false);

  const promptText = PROMPTS[promptIndex];

  // -----------------------------
  // LOAD SAVED STEP + DAILY LOCK
  // -----------------------------
  useEffect(() => {
    const savedStep = localStorage.getItem(STORAGE_KEY_STEP);
    const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
    const today = new Date().toISOString().slice(0, 10);

    if (savedStep) {
      const parsed = parseInt(savedStep, 10);
      setStep(parsed);

      // Only show ritual images if planted TODAY
      if (parsed > 0 && storedDate === today) {
        setHasPlanted(true);
      }
    }

    setSeedPlantedToday(storedDate === today);
  }, []);

  // -----------------------------
  // HANDLE PLANTING / TENDING
  // -----------------------------
  function handlePlantSeed() {
    if (seedPlantedToday) return;

    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(STORAGE_KEY_DATE, today);
    setSeedPlantedToday(true);

    // Ritual begins visually
    setHasPlanted(true);

    // Always start at step 1 on first planting
    const nextStep = step === 0 ? 1 : Math.min(step + 1, TOTAL_STEPS);

    setStep(nextStep);
    localStorage.setItem(STORAGE_KEY_STEP, String(nextStep));
  }

  // -----------------------------
  // DEVELOPER RESET SHORTCUT
  // Shift + Ctrl/Cmd + R
  // -----------------------------
  useEffect(() => {
    function handleDevReset(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (e.shiftKey && ctrlOrCmd && e.key.toLowerCase() === "r") {
        localStorage.removeItem(STORAGE_KEY_DATE);
        localStorage.removeItem(STORAGE_KEY_STEP);

        setStep(0);
        setHasPlanted(false);
        setSeedPlantedToday(false);

        alert("🌿 Ritual reset for development testing.");
      }
    }

    window.addEventListener("keydown", handleDevReset);
    return () => window.removeEventListener("keydown", handleDevReset);
  }, []);

  // -----------------------------
  // DEVELOPER NEXT-DAY SHORTCUT
  // Shift + Ctrl/Cmd + N
  // -----------------------------
  useEffect(() => {
    function handleNextDay(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (e.shiftKey && ctrlOrCmd && e.key.toLowerCase() === "n") {
        const tomorrow = new Date(Date.now() + 86400000)
          .toISOString()
          .slice(0, 10);

        localStorage.setItem(STORAGE_KEY_DATE, tomorrow);

        // Unlock button immediately
        setSeedPlantedToday(false);

        alert("🌞 Advanced to next day for development testing.");
      }
    }

    window.addEventListener("keydown", handleNextDay);
    return () => window.removeEventListener("keydown", handleNextDay);
  }, []);

  // -----------------------------
  // DETERMINE WHAT TO SHOW IN MIRROR
  // -----------------------------
  const mediaToShow =
    hasPlanted && step > 0
      ? RITUAL_STEPS[step - 1] // ⭐ OFF-BY-ONE FIX: step 1 -> index 0
      : "/bloom-videos/bloom-01.mp4";

  // Progress: 0..TOTAL_STEPS
  const progressPercent = (step / TOTAL_STEPS) * 100;

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
            Move through your 25‑step cinematic ritual. Each step is a moment of
            devotion to yourself — a quiet unfolding.
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
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs md:text-sm text-white/60 text-center md:text-right">
              Step {step} of {TOTAL_STEPS}. Move at your own pace—each step
              is a small act of care.
            </div>
          </div>
        </section>

        {/* SEA WITHIN MIRROR */}
        <SeaWithinMirrorSection
          mediaSrc={mediaToShow}
          promptText={promptText}
          onPlantSeed={handlePlantSeed}
          seedPlantedToday={seedPlantedToday}
        />
      </main>
    </div>
  );
}
