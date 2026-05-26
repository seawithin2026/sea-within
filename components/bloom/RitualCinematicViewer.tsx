"use client";

import { useEffect, useState } from "react";

const ritualSteps = [
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

export default function RitualCinematicViewer({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [stage, setStage] = useState(1);
  const [isVideo, setIsVideo] = useState(false);
  const [quest, setQuest] = useState("");

  // Load saved ritual progress
  useEffect(() => {
    const savedStage = localStorage.getItem("ritualStage");
    const savedQuest = localStorage.getItem("ritualQuest");

    if (savedStage) setStage(parseInt(savedStage));
    if (savedQuest) setQuest(savedQuest);
    else generateQuest();
  }, []);

  // Update video/image state
  useEffect(() => {
    setIsVideo(ritualSteps[stage - 1].endsWith(".mp4"));
    localStorage.setItem("ritualStage", stage.toString());
  }, [stage]);

  // Generate a gentle daily quest
  function generateQuest() {
    const quests = [
      "Place your hands on your heart and breathe slowly.",
      "Drink a full glass of water with intention.",
      "Step outside and feel the air on your skin.",
      "Sit in silence for a moment.",
      "Stretch your arms toward the sky.",
      "Write one kind sentence to yourself.",
    ];

    const q = quests[Math.floor(Math.random() * quests.length)];
    setQuest(q);
    localStorage.setItem("ritualQuest", q);
  }

  // Completing the quest advances the ritual
  function completeQuest() {
    if (stage < ritualSteps.length) {
      setStage(stage + 1);
      generateQuest();
    } else {
      onComplete();
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">

      {/* Cinematic Viewer */}
      <div className="w-full aspect-square max-w-md relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {!isVideo ? (
          <img
            key={stage}
            src={ritualSteps[stage - 1]}
            className="w-full h-full object-cover animate-fade-slide"
          />
        ) : (
          <video
            key={stage}
            src={ritualSteps[stage - 1]}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover animate-fade-slide"
          />
        )}
      </div>

      {/* Quest */}
      <div className="text-center text-white/70 text-sm max-w-xs">
        <p className="uppercase tracking-[0.22em] text-white/40 mb-2">
          Today's Ritual
        </p>
        <p>{quest}</p>
      </div>

      {/* Complete Button */}
      <button
        onClick={completeQuest}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400 text-black font-semibold tracking-wide shadow-lg hover:opacity-90 transition"
      >
        Complete Ritual
      </button>

      {/* Stage Indicator */}
      <p className="text-xs text-white/40 tracking-widest uppercase">
        Step {stage} of {ritualSteps.length}
      </p>
    </div>
  );
}
