"use client";

import React, { useEffect, useRef, useState } from "react";

type UIBloomVideo = {
  id: string;
  src: string;
  title: string;
  level: number;
  element: string; // ⭐ NEW
};


type BloomRevealProps = {
  earned: boolean;
  bloomVideo: UIBloomVideo;
  onSaved?: (bloomId: string) => void;
};


export const BloomReveal: React.FC<BloomRevealProps> = ({
  earned,
  bloomVideo,
  onSaved,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Aura / glow intensity based on level
  const glowIntensity = Math.min(1, 0.2 + bloomVideo.level * 0.15);
  const auraClass = getAuraClass(bloomVideo.level);

  useEffect(() => {
    // Reset when a new bloom is passed in
    setHasStarted(false);
    setHasFinished(false);
    setIsSaving(false);
    setError(null);
  }, [bloomVideo.id]);

  const handlePlay = () => {
    if (!earned || hasStarted) return;
    setHasStarted(true);
    videoRef.current?.play();
  };

  const handleVideoEnded = async () => {
    setHasFinished(true);
    try {
      setIsSaving(true);
      const stillDataUrl = captureStillFrame();
     await saveBloomToServer({
  bloomVideoId: bloomVideo.id,
  stillUrl: stillDataUrl,     // ⭐ rename
  level: bloomVideo.level,
  element: bloomVideo.element, // ⭐ NEW
});

      setIsSaving(false);
      if (onSaved) onSaved(bloomVideo.id);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      setError("Something went wrong saving your bloom. It is safe to try again.");
    }
  };

  const captureStillFrame = (): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return null;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.9);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      {/* BACKDROP AURA */}
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-700 ${auraClass}`}
        style={{
          opacity: earned ? glowIntensity : 0,
        }}
      />

      {/* BLOOM CARD */}
      <div className="relative z-10 max-w-xl w-full px-6 py-8 rounded-3xl bg-[rgba(8,8,12,0.85)] border border-[rgba(255,255,255,0.08)] shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center gap-4">
        <h2 className="text-center text-lg tracking-[0.18em] uppercase text-[rgba(255,255,255,0.7)]">
          Your Bloom
        </h2>
        <p className="text-center text-sm text-[rgba(255,255,255,0.6)]">
          {earned
            ? "You reached the flowering stage. When you are ready, let your bloom unfold."
            : "Nourish yourself to reach the flowering stage. The bloom will reveal itself when you earn it."}
        </p>

        {/* VIDEO CONTAINER */}
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.12)] bg-black/60">
          {/* Overlay gradient for depth */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/5" />

          <video
            ref={videoRef}
            src={bloomVideo.src}
            className="w-full h-full object-cover"
            muted
            playsInline
            onEnded={handleVideoEnded}
            onLoadedData={() => {
              // we keep it paused until user triggers
              if (!hasStarted) videoRef.current?.pause();
            }}
          />

          {/* LOCKED STATE OVERLAY */}
          {!earned && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <div className="mb-3 h-10 w-10 rounded-full border border-white/30 flex items-center justify-center text-xs tracking-[0.2em] uppercase text-white/70">
                Locked
              </div>
              <p className="text-xs text-center text-white/70 max-w-[80%]">
                Complete your current cycle to unlock this bloom.
              </p>
            </div>
          )}

          {/* READY TO PLAY CTA */}
          {earned && !hasStarted && (
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

          {/* FINISHED STATE LABEL */}
          {hasFinished && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 border border-white/20 text-[10px] tracking-[0.18em] uppercase text-white/80">
              Bloom saved to your garden
            </div>
          )}
        </div>

        {/* STATUS + ERROR */}
        <div className="h-5 flex items-center justify-center text-[11px] text-[rgba(255,255,255,0.6)]">
          {isSaving && <span>Saving your bloom…</span>}
          {!isSaving && hasFinished && !error && <span>You can revisit this bloom in your garden.</span>}
          {error && <span className="text-[rgba(255,180,180,0.9)]">{error}</span>}
        </div>
      </div>

      {/* HIDDEN CANVAS FOR STILL CAPTURE */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

function getAuraClass(level: number): string {
  if (level <= 1) {
    return "bg-radial-at-center from-emerald-400/25 via-sky-500/10 to-transparent";
  }
  if (level === 2) {
    return "bg-radial-at-center from-rose-400/30 via-amber-400/15 to-transparent";
  }
  if (level === 3) {
    return "bg-radial-at-center from-violet-400/35 via-sky-400/20 to-transparent";
  }
  return "bg-radial-at-center from-amber-300/40 via-rose-400/25 to-transparent";
}

type SaveBloomPayload = {
  bloomVideoId: string;
  stillUrl: string | null;
  level: number;
  element: string;
};


async function saveBloomToServer(payload: SaveBloomPayload) {
  const res = await fetch("/api/blooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bloomVideoId: payload.bloomVideoId,
      level: payload.level,
      stillUrl: payload.stillUrl,
      element: payload.element,
    }),
  });


  if (!res.ok) {
    throw new Error("Failed to save bloom");
  }

  return res.json();
}
