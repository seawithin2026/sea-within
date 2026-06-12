"use client";

import { useState, useEffect } from "react";
import { useAudio } from "@/app/providers/AudioProvider";

export default function MuteButton() {
  const { ambientMuted, setAmbientMuted } = useAudio();
  const [muted, setMuted] = useState(true);

  // ⭐ Sync with saved preference on load
  useEffect(() => {
    const saved = localStorage.getItem("muted");
    if (saved !== null) {
      const isMuted = saved === "true";
      setMuted(isMuted);
      setAmbientMuted(isMuted); // sync provider
    }
  }, [setAmbientMuted]);

  // ⭐ Apply mute state to global audio + keep bloom videos silent
  useEffect(() => {
    // Update global audio (AudioProvider)
    setAmbientMuted(muted);

    // Bloom videos ALWAYS muted
    const videos = Array.from(document.querySelectorAll("video")) as HTMLVideoElement[];
    videos.forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });

    // Save preference
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
