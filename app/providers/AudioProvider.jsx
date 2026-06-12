"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const AudioContextGlobal = createContext();

export function AudioProvider({ children }) {
  const ambientRef = useRef(null);

  // ⭐ Default: SOUND ON
  const [ambientMuted, setAmbientMuted] = useState(false);

  // ⭐ Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("muted");
    if (saved !== null) {
      setAmbientMuted(saved === "true");
    }
  }, []);

  // ⭐ Initialize audio once
  useEffect(() => {
    const audio = ambientRef.current;
    if (!audio) return;

    audio.volume = 0.07;
    audio.loop = true;

    audio.play().catch(() => {});
  }, []);

  // ⭐ Apply mute state + save preference
  useEffect(() => {
    const audio = ambientRef.current;
    if (!audio) return;

    audio.muted = ambientMuted;

    if (!ambientMuted) {
      audio.play().catch(() => {});
    }

    localStorage.setItem("muted", ambientMuted.toString());
  }, [ambientMuted]);

  return (
    <AudioContextGlobal.Provider value={{ ambientMuted, setAmbientMuted }}>
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
