"use client";
import { useState, useEffect } from "react";

export default function MuteButton() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const audio = document.getElementById("seaAudio") as HTMLAudioElement;
    if (audio) audio.muted = muted;
  }, [muted]);

  return (
    <button
      onClick={() => setMuted(!muted)}
      className="fixed bottom-6 right-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm text-sea-100 hover:bg-white/20 transition"
    >
      {muted ? "Unmute" : "Mute"}
    </button>
  );
}
