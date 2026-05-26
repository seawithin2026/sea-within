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

  useEffect(() => {
    const savedStage = localStorage.getItem("ritualStage");
    const savedQuest = localStorage.getItem("ritualQuest");

    if (savedStage) setStage(parseInt(savedStage));
    if (savedQuest) setQuest(savedQuest);
    else generateQuest();
  }, []);

  useEffect(() => {
    setIsVideo(ritualSteps[stage - 1].endsWith(".mp4"));
    localStorage.setItem("ritualStage", stage.toString());
  }, [stage]);

  function generateQuest() {
  const quests = [
    "Notice one thing about yourself that feels true today.",
    "Observe how your body feels without trying to change it.",
    "Recognize one quality you naturally express without effort.",
    "Take a sip of water and notice how your body receives it.",
    "Think of one food your body feels good after eating.",
    "Notice the sensation of hydration spreading through you.",
    "Feel the weight of your body being supported beneath you.",
    "Observe how your posture shifts when you breathe deeply.",
    "Notice one area of your body that feels strong today.",
    "Observe a thought as it appears, without following it.",
    "Notice what your mind focuses on when it’s calm.",
    "Recognize one thing you learned recently, no matter how small.",
    "Acknowledge the version of you who keeps going.",
    "Notice how your chest feels when you inhale slowly.",
    "Recognize a boundary you honored, even quietly.",
    "Touch something near you and observe its texture.",
    "Notice the temperature of the air on your skin.",
    "Observe how your breath changes when you soften your shoulders.",
    "Acknowledge one decision you made that supported you.",
    "Recognize one value that quietly guides your choices.",
    "Notice one thing you’re curious to understand about yourself.",
    "Gently stretch and observe where your body wants more space.",
    "Notice how your energy shifts after one slow breath.",
    "Acknowledge a strength you’ve shown recently, even if small.",
    "Say quietly to yourself: “I am becoming more myself.”",
  ];

  const q = quests[Math.floor(Math.random() * quests.length)];
  setQuest(q);
  localStorage.setItem("ritualQuest", q);
}


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

      <div className="text-center text-white/70 text-sm max-w-xs">
        <p className="uppercase tracking-[0.22em] text-white/40 mb-2">
          Today's Ritual
        </p>
        <p>{quest}</p>
      </div>

      <button
        onClick={completeQuest}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400 text-black font-semibold tracking-wide shadow-lg hover:opacity-90 transition"
      >
        Complete Ritual
      </button>

      <p className="text-xs text-white/40 tracking-widest uppercase">
        Step {stage} of {ritualSteps.length}
      </p>
    </div>
  );
}
