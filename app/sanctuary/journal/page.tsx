"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { SeaWithinMirrorSection } from "@/components/mirror/SeaWithinMirrorSection";

type Prompt = {
  id: string;
  level: number;
  text: string;
};

const PROMPTS: Prompt[] = [
  {
    id: "l1-1",
    level: 1,
    text:
      "Drink a full glass of water slowly, noticing how your body receives it. This is how you water your inner flower today.",
  },
  {
    id: "l1-2",
    level: 1,
    text:
      "Take three slow breaths and place a hand on your heart. Notice one thing your body has carried you through recently.",
  },
  {
    id: "l1-3",
    level: 1,
    text:
      "Choose one small act of kindness for yourself today—a softer tone, a slower pace, or a moment of stillness.",
  },
];

const STORAGE_KEY_PROMPT_ID = "seaWithin.currentPromptId";
const STORAGE_KEY_DATE = "seaWithin.promptDate";

function getPromptById(id: string | null): Prompt | undefined {
  if (!id) return undefined;
  return PROMPTS.find((p) => p.id === id);
}

function getNewPrompt(excludeId?: string | null): Prompt {
  const available = PROMPTS.filter((p) => p.id !== excludeId);
  return available[0] ?? PROMPTS[0];
}

export default function BloomJournalPage() {
  const [promptText, setPromptText] = useState<string>("");
  const [currentPromptId, setCurrentPromptId] = useState<string | null>(null);
  const [seedPlantedToday, setSeedPlantedToday] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const storedDate = typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY_DATE)
      : null;
    const storedPromptId = typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY_PROMPT_ID)
      : null;

    if (storedDate === today && storedPromptId) {
      const existing = getPromptById(storedPromptId);
      if (existing) {
        setCurrentPromptId(existing.id);
        setPromptText(existing.text);
        setSeedPlantedToday(true);
        return;
      }
    }

    const next = getNewPrompt(storedPromptId);
    setCurrentPromptId(next.id);
    setPromptText(next.text);

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_PROMPT_ID, next.id);
      localStorage.setItem(STORAGE_KEY_DATE, today);
    }

    setSeedPlantedToday(false);
  }, []);

  function handlePlantSeed() {
    setSeedPlantedToday(true);
    // Later: trigger animations, flower evolution, etc.
  }

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
                    style={{ width: seedPlantedToday ? "100%" : "40%" }}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs md:text-sm text-white/60 text-center md:text-right">
              {seedPlantedToday
                ? "You’ve planted today’s seed. Let the rest of your day water it."
                : "Your seed is waiting. Activate it when you’re ready to tend to yourself."}
            </div>
          </div>
        </section>

        {/* SEA WITHIN MIRROR MASTERPIECE */}
        <SeaWithinMirrorSection
          videoSrc="/ritual/your-video-file.mp4"
          promptText={promptText}
          onPlantSeed={handlePlantSeed}
        />
      </main>
    </div>
  );
}
