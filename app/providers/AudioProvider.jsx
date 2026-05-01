"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const AudioContextGlobal = createContext();

export function AudioProvider({ children }) {
  const ambientRef = useRef(null);
  const [ambientMuted, setAmbientMuted] = useState(false);
  const [narratorMuted, setNarratorMuted] = useState(false);

  useEffect(() => {
    const audio = ambientRef.current;
    if (!audio) return;

    audio.volume = 0.07
    audio.loop = true;

    // Try autoplay
    audio.play().catch(() => {
      // If autoplay is blocked, unmute will trigger play later
    });
  }, []);

  return (
    <AudioContextGlobal.Provider
      value={{
        ambientMuted,
        setAmbientMuted,
        narratorMuted,
        setNarratorMuted,
      }}
    >
      <audio
        ref={ambientRef}
        src="/audio/narration/season-1/ambient-main.mp3"
        muted={ambientMuted}
      />

      {children}
    </AudioContextGlobal.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContextGlobal);
}