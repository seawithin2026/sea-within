"use client";
import { useState, useEffect } from "react";

export default function MuteButton() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const audio = document.getElementById("seaAudio") as HTMLAudioElement | null;
    if (audio) {
      audio.muted = muted;
    }
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
