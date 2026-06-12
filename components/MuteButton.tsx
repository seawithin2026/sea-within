"use client";

import { useState, useEffect } from "react";
import { useAudio } from "@/app/providers/AudioProvider";

export default function MuteButton() {
  const { ambientMuted, setAmbientMuted } = useAudio();

  // ⭐ Default: SOUND ON
  const [muted, setMuted] = useState(false);

  // ⭐ Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("muted");
    if (saved !== null) {
      const isMuted = saved === "true";
      setMuted(isMuted);
      setAmbientMuted(isMuted);
    }
  }, [setAmbientMuted]);

  // ⭐ Apply mute state + keep bloom videos muted
  useEffect(() => {
    setAmbientMuted(muted);

    const videos = Array.from(document.querySelectorAll("video"));
    videos.forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });

    localStorage.setItem("muted", muted.toString());
  }, [muted, setAmbientMuted]);

  return (
    <button
      onClick={() => setMuted(!muted)}
      className="mute-button"
      aria-label="Toggle sound"
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
