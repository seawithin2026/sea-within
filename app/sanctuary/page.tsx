"use client";

import React, { useEffect, useState } from "react";

const ambientAudioSrc = "/audio/sanctuary-ambient.mp3"; // put your loop here

type Mood = "morning" | "evening" | "night";

function getMoodByTime(): Mood {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 17) return "morning";
  if (hour >= 17 && hour < 22) return "evening";
  return "night";
}

function getWelcomeMessage(stage: "new" | "started" | "returning") {
  if (stage === "new") return "Welcome. You’re safe here.";
  if (stage === "started") return "You’ve begun. I’m proud of you.";
  return "It’s okay. You’re here now.";
}

export default function SanctuaryPage() {
  const [showEntrance, setShowEntrance] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [mood, setMood] = useState<Mood>("morning");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMood(getMoodByTime());

    const visited = window.localStorage.getItem("sanctuary-visited");
    if (visited) setHasVisitedBefore(true);

    const started = window.localStorage.getItem("sanctuary-started");
    if (started) setHasStarted(true);

    const handleScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const depth = max > 0 ? window.scrollY / max : 0;
      setScrollDepth(Math.min(1, Math.max(0, depth)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.4;
  }, [audio]);

  const handleEnter = () => {
    setShowEntrance(false);
    window.localStorage.setItem("sanctuary-visited", "true");
    window.localStorage.setItem("sanctuary-started", "true");
    setHasStarted(true);

    if (!audio) {
      const a = new Audio(ambientAudioSrc);
      setAudio(a);
      a.play().catch(() => {});
    } else {
      audio.play().catch(() => {});
    }
  };

  const stage: "new" | "started" | "returning" = !hasVisitedBefore
    ? "new"
    : hasStarted
    ? "started"
    : "returning";

  const welcome = getWelcomeMessage(stage);

  const moodGradient =
    mood === "morning"
      ? "from-sky-300/40 via-teal-500/40 to-slate-900"
      : mood === "evening"
      ? "from-amber-300/30 via-indigo-700/50 to-slate-950"
      : "from-slate-900 via-slate-950 to-black";

  const depthOverlayOpacity = 0.2 + scrollDepth * 0.6;

  return (
    <main className={`relative min-h-screen text-white bg-black overflow-hidden`}>
      {/* Background gradient that deepens with scroll */}
      <div
        className={`pointer-events-none fixed inset-0 bg-gradient-to-b ${moodGradient}`}
        style={{ opacity: 0.6 + scrollDepth * 0.3 }}
      />

      {/* Depth overlay */}
      <div
        className="pointer-events-none fixed inset-0 bg-black"
        style={{ opacity: depthOverlayOpacity }}
      />

      {/* Living entrance ritual overlay */}
      {showEntrance && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="text-center px-6 max-w-md">
            <div className="mb-6 text-xs tracking-[0.3em] uppercase text-teal-200">
              Sea Within Sanctuary
            </div>
            <p className="text-lg text-teal-100 mb-4">
              You&apos;re here. Breathe. You made it.
            </p>
            <p className="text-sm text-gray-300 mb-8">
              Let the world fall away for a moment. This space is only for you.
            </p>
            <button
              onClick={handleEnter}
              className="px-8 py-3 rounded-full bg-teal-400 text-black text-xs tracking-[0.2em] uppercase"
            >
              Enter the Sanctuary
            </button>
          </div>
        </div>
      )}

      {/* Breathing UI element */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-3 text-xs text-gray-300">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full bg-teal-400/40 animate-ping" />
          <div className="relative w-8 h-8 rounded-full bg-teal-300/80 shadow-lg shadow-teal-500/40" />
        </div>
        <span>Just breathe.</span>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-32 space-y-16">
        {/* Welcome block */}
        <section className="space-y-4">
          <p className="text-xs tracking-[0.3em] uppercase text-teal-200">
            Sanctuary
          </p>
          <h1 className="text-3xl md:text-4xl font-light leading-snug">
            {welcome}
          </h1>
          <p className="text-sm text-gray-300 max-w-xl">
            This is your inner ocean. Move slowly. There is nowhere else you
            need to be.
          </p>
        </section>

        {/* Ritual space */}
        <section className="space-y-4">
          <h2 className="text-xl font-light">Today&apos;s ritual</h2>
          <p className="text-gray-200 text-sm">
            Before you go deeper, place one hand on your chest and one on your
            belly. Feel the rise and fall. Let your breath match the slow pulse
            of this space.
          </p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-gray-300 mb-2">
              A thought, a feeling, a word you want to leave here:
            </p>
            <textarea
              className="w-full bg-transparent border border-white/15 rounded-lg p-2 text-sm outline-none focus:border-teal-300/70"
              rows={3}
              placeholder="You can write it here and let it stay in this space..."
            />
          </div>
        </section>

        {/* Journey / chapters */}
        <section className="space-y-6">
          <h2 className="text-xl font-light">Your descent</h2>
          <p className="text-sm text-gray-300 max-w-xl">
            Move through these doors at your own pace. Each one is a different
            depth, a different part of you.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <SanctuaryDoor
              title="Season 1 — The Return"
              description="A soft landing back into yourself."
            />
            <SanctuaryDoor
              title="Season 2 — The Descent"
              description="Shadow, truth, and the parts you’ve avoided."
              comingSoon
            />
            <SanctuaryDoor
              title="Season 3 — The Becoming"
              description="Identity, embodiment, direction."
              comingSoon
            />
            <SanctuaryDoor
              title="Season 4 — The Rising"
              description="Integration, expression, expansion."
              comingSoon
            />
          </div>
        </section>

        {/* Closing */}
        <section className="space-y-4">
          <h2 className="text-xl font-light">When you&apos;re ready</h2>
          <p className="text-sm text-gray-300 max-w-xl">
            You can leave this space at any time. It will still be here. The
            water doesn&apos;t rush you. It waits.
          </p>
        </section>
      </div>
    </main>
  );
}

function SanctuaryDoor({
  title,
  description,
  comingSoon,
}: {
  title: string;
  description: string;
  comingSoon?: boolean;
}) {
  return (
    <button
      className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 px-4 py-5 text-left"
      type="button"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-300/10 via-transparent to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative space-y-2">
        <p className="text-xs tracking-[0.25em] uppercase text-teal-200">
          {comingSoon ? "Coming soon" : "Available"}
        </p>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-xs text-gray-300">{description}</p>
      </div>
    </button>
  );
}
