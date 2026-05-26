"use client";

import React from "react";
import RitualCinematicViewer from "./RitualCinematicViewer";

type BloomRevealProps = {
  earned: boolean;
  onComplete?: () => void;
};

export const BloomReveal: React.FC<BloomRevealProps> = ({
  earned,
  onComplete,
}) => {
  function handleRitualFinished() {
    if (onComplete) onComplete();
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <div className="relative z-10 max-w-xl w-full px-6 py-8 rounded-3xl bg-[rgba(8,8,12,0.85)] border border-[rgba(255,255,255,0.08)] shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center gap-6">
        
        <h2 className="text-center text-lg tracking-[0.18em] uppercase text-[rgba(255,255,255,0.7)]">
          Your Ritual
        </h2>

        <p className="text-center text-sm text-[rgba(255,255,255,0.6)] max-w-md">
          {earned
            ? "Move through each step at your own pace. When you complete the cycle, your ritual for today is complete."
            : "You’ve already completed today’s ritual. You may revisit the journey if you wish."}
        </p>

        <RitualCinematicViewer onComplete={handleRitualFinished} />
      </div>
    </div>
  );
};
