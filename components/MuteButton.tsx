"use client";
import { useState, useEffect } from "react";

export default function MuteButton() {
  const [muted, setMuted] = useState(true);

useEffect(() => {
  const audio = document.getElementById("seaAudio") as HTMLAudioElement | null;
  const videos = Array.from(document.querySelectorAll("video")) as HTMLVideoElement[];

  if (audio) audio.muted = muted;
  videos.forEach(v => v.muted = muted);
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
