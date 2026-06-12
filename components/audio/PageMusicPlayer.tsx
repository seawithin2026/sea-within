"use client";
import { useEffect, useRef } from "react";

export default function PageMusicPlayer({ src, volume = 0.25 }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;

    // Sync with global mute state
    const applyMute = () => {
      const muted = localStorage.getItem("muted") === "true";
      audio.muted = muted;
      if (!muted) audio.play().catch(() => {});
    };

    applyMute();

    // Listen for mute changes
    window.addEventListener("storage", applyMute);

    audioRef.current = audio;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      window.removeEventListener("storage", applyMute);
    };
  }, [src, volume]);

  return null;
}
