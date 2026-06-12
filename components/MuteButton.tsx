"use client";
import { useState, useEffect } from "react";

export default function MuteButton() {
  const [muted, setMuted] = useState(true);

  // ⭐ Sync with saved preference on load
  useEffect(() => {
    const saved = localStorage.getItem("muted");
    if (saved !== null) {
      setMuted(saved === "true");
    }
  }, []);

  // ⭐ Apply mute state to audio + all videos
  useEffect(() => {
    const audio = document.getElementById("seaAudio") as HTMLAudioElement | null;
    const videos = Array.from(document.querySelectorAll("video")) as HTMLVideoElement[];

    if (audio) {
      audio.muted = muted;
      if (!muted) audio.play().catch(() => {});
    }

    videos.forEach(v => {
      v.muted = muted;
      if (!muted) v.play().catch(() => {});
    });

    localStorage.setItem("muted", muted.toString());
  }, [muted]);

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
