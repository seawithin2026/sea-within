"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { SeaWithinMirrorSection } from "@/components/mirror/SeaWithinMirrorSection";

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

const PROMPTS = [
  "Drink a full glass of water slowly, noticing how your body receives it.",
  "Do a gentle neck stretch: slow circles, side-to-side, no strain.",
  "Open a window and take one refreshing breath of outdoor air.",
  "Rub your hands together gently, warming the energy of your seed.",
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

const STORAGE_KEY_DATE = "seaWithin.seedDate";
const STORAGE_KEY_STEP = "seaWithin.ritualStep";
const STORAGE_KEY_TENDED = "seaWithin.tendedToday";
const STORAGE_KEY_PROMPT = "seaWithin.promptIndex";

export default function BloomJournalPage() {
  const [step, setStep] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);
  const [seedPlantedToday, setSeedPlantedToday] = useState(false);
  const [hasTendedToday, setHasTendedToday] = useState(false);

  // 🌸 RESET CYCLE — manual only
  function resetCycle() {
    // rotate prompt for next cycle
    const nextPrompt = (promptIndex + 1) % PROMPTS.length;
    setPromptIndex(nextPrompt);
    localStorage.setItem(STORAGE_KEY_PROMPT, String(nextPrompt));

    // clear ritual state
    localStorage.removeItem(STORAGE_KEY_DATE);
    localStorage.removeItem(STORAGE_KEY_STEP);
    localStorage.removeItem(STORAGE_KEY_TENDED);

    // reset UI
    setStep(0);
    setSeedPlantedToday(false);
    setHasTendedToday(false);
  }

  // 🌿 UNIFIED STEP ADVANCER
  function advanceStep() {
    const next = Math.min(step + 1, TOTAL_STEPS);
    setStep(next);
    localStorage.setItem(STORAGE_KEY_STEP, String(next));
  }

  useEffect(() => {
    const savedStep = Number(localStorage.getItem(STORAGE_KEY_STEP)) || 0;
    const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
    const tendedDate = localStorage.getItem(STORAGE_KEY_TENDED);
    const savedPrompt = Number(localStorage.getItem(STORAGE_KEY_PROMPT)) || 0;

    const today = new Date().toISOString().slice(0, 10);

    setStep(savedStep);
    setPromptIndex(savedPrompt);
    setSeedPlantedToday(storedDate === today);
    setHasTendedToday(tendedDate === today);
  }, []);
  // DEV SHORTCUTS — only active for you
useEffect(() => {
  function handleKey(e: KeyboardEvent) {
    // CMD + SHIFT + ] → next step
    if (e.metaKey && e.shiftKey && e.key === "]") {
      advanceStep();
    }

    // CMD + SHIFT + [ → previous step
    if (e.metaKey && e.shiftKey && e.key === "[") {
      const prev = Math.max(step - 1, 0);
      setStep(prev);
      localStorage.setItem(STORAGE_KEY_STEP, String(prev));
    }

    // CMD + SHIFT + R → reset cycle
    if (e.metaKey && e.shiftKey && e.key === "R") {
      resetCycle();
    }

    // CMD + SHIFT + 2 → jump to final bloom (step 25)
    if (e.metaKey && e.shiftKey && e.key === "2") {
      setStep(25);
      localStorage.setItem(STORAGE_KEY_STEP, "25");
    }
  }

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [step]);


  // 🌱 PLANT SEED — only allowed at step 0
  function handlePlantSeed() {
    if (step !== 0) return;

    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(STORAGE_KEY_DATE, today);
    setSeedPlantedToday(true);

    advanceStep(); // 0 → 1
  }

  // 🌿 TEND PLANT — only allowed between steps 1–24
  function handleTendPlant() {
    if (step <= 0 || step >= 25) return;
    if (hasTendedToday) return;

    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(STORAGE_KEY_TENDED, today);
    setHasTendedToday(true);

    advanceStep(); // 1 → 2 → ... → 25
  }

  const mediaToShow =
    step === 0 ? "/bloom-videos/bloom-01.mp4" : RITUAL_STEPS[step - 1];

  const progressPercent = (step / TOTAL_STEPS) * 100;
  const promptText = PROMPTS[promptIndex];

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20 pb-16">

        {/* HERO */}
        <section className="mt-20 md:mt-28 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto text-center md:text-left">
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

        {/* CINEMATIC MIRROR SECTION */}
        <section className="w-full min-h-[85vh] flex items-stretch">
          <SeaWithinMirrorSection
            mediaSrc={mediaToShow}
            promptText={promptText}
            onPlantSeed={handlePlantSeed}
            onTendPlant={handleTendPlant}
            seedPlantedToday={seedPlantedToday}
            step={step}
            hasTendedToday={hasTendedToday}
          />
        </section>

        {/* PROGRESS BAR */}
        <section className="mt-10 px-6 md:px-10 lg:px-16 max-w-6xl mx-auto">
          <div
            className="
              w-full rounded-2xl border border-white/10 
              bg-black/40
              px-6 py-4 
              flex flex-col md:flex-row items-center justify-between gap-6
              shadow-[0_0_25px_rgba(255,255,255,0.08)]
              backdrop-blur-md
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  h-[60px] w-[60px]
                  rounded-xl overflow-hidden 
                  shadow-[0_0_20px_rgba(255,255,255,0.15)]
                  bg-black
                "
              >
                <video
                  src="/ritual/5-glowing-seed.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-xs md:text-sm text-white/60 tracking-wide">
                  Ritual progress
                </p>

                <div className="mt-1 h-2 w-40 md:w-56 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="
                      h-full rounded-full 
                      bg-gradient-to-r from-white/70 to-white/30
                      shadow-[0_0_10px_rgba(255,255,255,0.4)]
                      transition-all duration-500
                    "
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs md:text-sm text-white/60 text-center md:text-right">
              Step {step} of {TOTAL_STEPS}
            </div>
          </div>
        </section>

        {/* START NEW CYCLE BUTTON */}
        {step === 25 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={resetCycle}
              className="px-8 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-amber-300/40 bg-white/5 text-amber-100 hover:bg-white/10 transition-all"
            >
              Start a New Cycle
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
