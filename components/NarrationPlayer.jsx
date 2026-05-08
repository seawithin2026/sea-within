"use client";

import { useEffect, useRef, useState } from "react";
import { NarratorText } from "@/lib/voice/NarratorText";

export default function NarrationPlayer({ audioSrc, script, config, onReady }) {
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [isReady, setIsReady] = useState(false);

  // Load audio
  useEffect(() => {
    if (!audioSrc) return;

    const audio = new Audio(audioSrc);

    audio.volume = config?.volume ?? 0.28;
    audio.playbackRate = config?.playbackRate ?? 0.94;

    audio.addEventListener("canplaythrough", () => setIsReady(true));

    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
      clearInterval(intervalRef.current);
    };
  }, [audioSrc, config]);

  // Play + animate lines
  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;

    clearInterval(intervalRef.current);

    audio.currentTime = 0;
    audio.play();

    // Start at first line
    setActiveLineIndex(0);

    let index = 0;

    intervalRef.current = setInterval(() => {
      index += 1;

      if (index >= script.length) {
        clearInterval(intervalRef.current);
        return;
      }

      setActiveLineIndex(index);
    }, config.lineDelay);
  };

  // Expose play() to parent
  useEffect(() => {
    if (isReady && onReady) onReady(play);
  }, [isReady, onReady]);

  return (
    <div className="narratorContainer">
      {!isReady && <p className="loadingText">Loading…</p>}

      <NarratorText
        lines={script}
        activeIndex={activeLineIndex}
        className="narratorLines narratorLines--magic"
      />
    </div>
  );
}
