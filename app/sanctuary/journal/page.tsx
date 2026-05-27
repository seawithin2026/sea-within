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
// PROMPTS (25 gentle rituals)
// -----------------------------
const PROMPTS = [
  "Drink a full glass of water slowly, noticing how your body receives it.",
  "Do a gentle neck stretch: slow circles, side-to-side, no strain.",
  "Open a window and take one refreshing breath of outdoor air.",
  "Rub your hands together for 5 seconds and feel the warmth settle.",
  "Take one slow sip of your favorite drink and savor the taste.",
  "Roll your shoulders back 5 times to release tension.",
  "Walk to another room with intention, noticing your steps.",
  "Splash cool water on your face to refresh your senses.",
  "Take one deep breath in and one long breath out.",
  "Reach your arms overhead and stretch gently for 3 seconds.",
  "Close your eyes for one second and think of one tiny thing you appreciate.",
  "Sit or stand a little taller and soften your shoulders.",
  "Hold a warm mug and feel the heat in your hands.",
  "Put away one small item around you — just one.",
  "Step outside for 10 seconds and feel the air on your skin.",
  "Give yourself a tiny, soft smile — just enough to feel it.",
  "Apply a bit of lotion and massage your hands for a moment.",
  "Look up at the ceiling or sky and take a slow breath.",
  "Place one hand on your chest and feel one breath rise and fall.",
  "Sit still for 5 seconds and notice one sound around you.",
  "Wiggle your toes or rotate your ankles gently.",
  "Take a moment to check if you need another sip of water.",
  "Gently touch your arm or shoulder and notice the sensation.",
  "Eat one nourishing bite of something that feels good to your body.",
  "Inhale while lifting your arms, exhale while lowering them.",
];

// -----------------------------
// STORAGE KEYS
// -----------------------------
const STORAGE_KEY_DATE = "seaWithin.seedDate";
const STORAGE_KEY_STEP = "seaWithin.ritualStep";
const STORAGE_KEY_TENDED = "seaWithin.tendedToday";
const STORAGE_KEY_PROMPT = "seaWithin.promptIndex";
const STORAGE_KEY_LAST_COMPLETED = "seaWithin.lastCompletedDate";

export default function BloomJournalPage() {
  const [step, setStep] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);
  const [seedPlantedToday, setSeedPlantedToday] = useState(false);
  const [hasPlanted, setHasPlanted] = useState(false);
  const [hasTendedToday, setHasTendedToday] = useState(false);

  // -----------------------------
  // LOAD SAVED STATE
  // -----------------------------
  useEffect(() => {
    const savedStep = localStorage.getItem(STORAGE_KEY_STEP);
    const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
    const tendedDate = localStorage.getItem(STORAGE_KEY_TENDED);
    const savedPrompt = localStorage.getItem(STORAGE_KEY_PROMPT);
    const lastCompletedDate = localStorage.getItem(STORAGE_KEY_LAST_COMPLETED);

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    if (savedStep) {
      const parsedStep = parseInt(savedStep, 10);
      setStep(parsedStep);
      if (parsedStep > 0 && storedDate === today) {
        setHasPlanted(true);
      }
    }

    if (savedPrompt) {
      setPromptIndex(parseInt(savedPrompt, 10));
    }

    setSeedPlantedToday(storedDate === today);
    setHasTendedToday(tendedDate === today);

    if (lastCompletedDate === yesterday) {
      const nextPrompt = (parseInt(savedPrompt || "0") + 1) % PROMPTS.length;
      setPromptIndex(nextPrompt);
      localStorage.setItem(STORAGE_KEY_PROMPT, String(nextPrompt));
    }
  }, []);

  // -----------------------------
  // HANDLE PLANTING
  // -----------------------------
  function handlePlantSeed() {
    if (seedPlantedToday) return;

    const today = new Date().toISOString().slice(0, 10);

    localStorage.setItem(STORAGE_KEY_DATE, today);
    setSeedPlantedToday(true);
    setHasPlanted(true);

    const nextStep = step === 0 ? 1 : Math.min(step + 1, TOTAL_STEPS);
    setStep(nextStep);
    localStorage.setItem(STORAGE_KEY_STEP, String(nextStep));
  }

  // -----------------------------
  // HANDLE DAILY TENDING
  // -----------------------------
  function handleTendPlant() {
    if (!seedPlantedToday || hasTendedToday) return;

    const nextStep = Math.min(step + 1, TOTAL_STEPS);
    setStep(nextStep);
    localStorage.setItem(STORAGE_KEY_STEP, String(nextStep));

    const today = new Date().toISOString().slice(0, 10);

    localStorage.setItem(STORAGE_KEY_TENDED, today);
    setHasTendedToday(true);

    localStorage.setItem(STORAGE_KEY_LAST_COMPLETED, today);
  }

  // -----------------------------
  // DETERMINE MEDIA
  // -----------------------------
  const mediaToShow =
    step > 0 ? RITUAL_STEPS[step - 1] : "/bloom-videos/bloom-01.mp4";

  const progressPercent = (step / TOTAL_STEPS) * 100;
  const promptText = PROMPTS[promptIndex];

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20 pb-16">

        {/* HERO */}
        <section className="mt-8 md:mt-12 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto text-center md:text-left">
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

        {/* MIRROR / OVAL VIDEO */}
        <SeaWithinMirrorSection
          mediaSrc={mediaToShow}
          promptText={promptText}
          onPlantSeed={handlePlantSeed}
          onTendPlant={handleTendPlant}
          seedPlantedToday={seedPlantedToday}
          step={step}
          hasTendedToday={hasTendedToday}
        />

        {/* GOLD-ERA PROGRESS BAR — MOVED TO BOTTOM */}
        <section className="mt-10 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto">
          <div className="
            w-full rounded-3xl border border-amber-300/40 
            bg-gradient-to-r from-[#3b2a14] via-[#5a3f1c] to-[#3b2a14]
            px-6 py-5 
            flex flex-col md:flex-row items-center justify-between gap-4
            shadow-[0_0_45px_rgba(255,200,120,0.25)]
            relative
            overflow-hidden
          ">

            <div className="
              absolute inset-0 
              bg-[radial-gradient(circle_at_top,_rgba(255,220,150,0.25),_transparent_70%)]
              pointer-events-none
            " />

            <div className="flex items-center gap-4 relative z-10">

              <div className="
                relative h-12 w-12 rounded-full 
                bg-gradient-to-br from-amber-300/80 to-amber-100/40
                flex items-center justify-center 
                shadow-[0_0_25px_rgba(255,200,120,0.45)]
              ">
                <img 
                  src="/lotus/lotus-amber.png"
                  alt="Lotus Icon"
                  className="h-25 w-25 opacity-95 drop-shadow-[0_0_6px_rgba(255,200,120,0.6)]"
                />
              </div>

              <div className="text-left">
                <p className="text-xs md:text-sm text-amber-200/80 tracking-wide">
                  Today’s ritual progress
                </p>

                <div className="mt-1 h-2 w-40 md:w-56 rounded-full bg-amber-200/20 overflow-hidden shadow-inner">
                  <div
                    className="
                      h-full rounded-full 
                      bg-gradient-to-r from-amber-300 via-amber-200 to-amber-100
                      shadow-[0_0_12px_rgba(255,220,150,0.6)]
                      transition-all duration-500
                    "
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs md:text-sm text-amber-200/80 text-center md:text-right relative z-10">
              Step {step} of {TOTAL_STEPS}.  
              <span className="text-amber-100/90">Your bloom unfolds gently.</span>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
