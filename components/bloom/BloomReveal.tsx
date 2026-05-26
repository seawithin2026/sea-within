"use client";

import React, { useRef, useState } from "react";
import RitualCinematicViewer from "./RitualCinematicViewer";

type UIBloomVideo = {
  id: string;
  src: string;
  title: string;
  level: number;
  element: string;
};

type BloomRevealProps = {
  earned: boolean;
  bloomVideo: UIBloomVideo;
  onSaved?: () => void;
};

export const BloomReveal: React.FC<BloomRevealProps> = ({
  earned,
  bloomVideo,
  onSaved,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [ritualComplete, setRitualComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  // ------------------------------------------------------------
  // BLOOM VIDEO LOGIC
  // ------------------------------------------------------------
  const handlePlay = () => {
    if (!earned || hasStarted) return;
    setHasStarted(true);
    videoRef.current?.play();
  };

  const handleVideoEnded = () => {
    setHasFinished(true);
    if (onSaved) onSaved();
  };

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">

      {/* BLOOM CARD */}
      <div className="relative z-10 max-w-xl w-full px-6 py-8 rounded-3xl bg-[rgba(8,8,12,0.85)] border border-[rgba(255,255,255,0.08)] shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center gap-6">

        <h2 className="text-center text-lg tracking-[0.18em] uppercase text-[rgba(255,255,255,0.7)]">
          Your Bloom
        </h2>

        {/* ------------------------------------------------------------ */}
        {/* 1. RITUAL FIRST — replaces old play button area               */}
        {/* ------------------------------------------------------------ */}
        {!ritualComplete && (
          <RitualCinematicViewer
            onComplete={() => setRitualComplete(true)}
          />
        )}

        {/* ------------------------------------------------------------ */}
        {/* 2. BLOOM VIDEO — only shows AFTER ritual is complete         */}
        {/* ------------------------------------------------------------ */}
        {ritualComplete && (
          <>
            <p className="text-center text-sm text-[rgba(255,255,255,0.6)]">
              When you are ready, let your bloom unfold.
            </p>

            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.12)] bg-black/60">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/5" />

              <video
                ref={videoRef}
                src={bloomVideo.src}
                className="w-full h-full object-cover"
                muted
                playsInline
                onEnded={handleVideoEnded}
                onLoadedData={() => {
                  if (!hasStarted) videoRef.current?.pause();
                }}
              />

              {!hasStarted && (
                <button
                  type="button"
                  onClick={handlePlay}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/30 transition-colors"
                >
                  <div className="h-14 w-14 rounded-full border border-[rgba(255,255,255,0.7)] flex items-center justify-center bg-white/10 backdrop-blur-md">
                    <div className="ml-1 border-l-[10px] border-l-white border-y-[7px] border-y-transparent" />
                  </div>
                  <span className="mt-3 text-[11px] tracking-[0.22em] uppercase text-[rgba(255,255,255,0.8)]">
                    Let it unfold
                  </span>
                </button>
              )}

              {hasFinished && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-[10px] tracking-[0.18em] uppercase text-white/80">
                  Bloom complete
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
