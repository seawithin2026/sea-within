"use client";

import { useEffect, useRef, useState } from "react";

export function useNarrator(section) {
  const audioRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);

  // Load audio
  useEffect(() => {
    const audio = new Audio(section.audioSrc);
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => {
      setIsReady(true);
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [section.audioSrc]);

  // Play function
  const play = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play();

    // Reveal lines in sync
    let index = 0;
    setActiveLineIndex(0);

    const interval = setInterval(() => {
      index++;
      if (index >= section.lines.length) {
        clearInterval(interval);
      } else {
        setActiveLineIndex(index);
      }
    }, 2000); // adjust timing if needed
  };

  return {
    play,
    isReady,
    activeLineIndex,
  };
}
