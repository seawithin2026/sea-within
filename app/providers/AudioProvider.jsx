"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

const AudioContextGlobal = createContext();

export function AudioProvider({ children }) {
  const ambientRef = useRef(null);
  const [ambientMuted, setAmbientMuted] = useState(true);

  // ⭐ Load saved mute preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("muted");
    if (saved !== null) {
      const isMuted = saved === "true";
      setAmbientMuted(isMuted);
    }
  }, []);

  // ⭐ Initialize global audio once
  useEffect(() => {
    const audio = ambientRef.current;
    if (!audio) return;

    audio.volume = 0.07;
    audio.loop = true;

    // Try to autoplay (browser may block until user interacts)
    audio.play().catch(() => {});
  }, []);

  // ⭐ Apply mute state to the global audio element
  useEffect(() => {
    const audio = ambientRef.current;
    if (!audio) return;

    audio.muted = ambientMuted;

    if (!ambientMuted) {
      audio.play().catch(() => {});
    }

    // Save preference
    localStorage.setItem("muted", ambientMuted.toString());
  }, [ambientMuted]);

  return (
    <AudioContextGlobal.Provider
      value={{
        ambientMuted,
        setAmbientMuted,
      }}
    >
      {/* GLOBAL SOUNDTRACK (the ONLY one) */}
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
