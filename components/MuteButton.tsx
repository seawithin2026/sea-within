"use client";

import { useState, useEffect } from "react";
import { useAudio } from "@/app/providers/AudioProvider";

export default function MuteButton() {
  const { ambientMuted, setAmbientMuted } = useAudio();

  // ⭐ Default: SOUND ON
  const [muted, setMuted] = useState(false);

  // ⭐ Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("muted");
    if (saved !== null) {
      const isMuted = saved === "true";
      setMuted(isMuted);
      setAmbientMuted(isMuted);
    }
  }, [setAmbientMuted]);

  // ⭐ Apply mute state + keep bloom videos muted
  useEffect(() => {
    setAmbientMuted(muted);

    const videos = Array.from(document.querySelectorAll("video"));
    videos.forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });

    localStorage.setItem("muted", muted.toString());
  }, [muted, setAmbientMuted]);

  return (
    <button
  onClick={() => setMuted(!muted)}
  className="mute-button"
  aria-label="Toggle sound"
>
  {muted ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="icon"
    >
      <path d="M9 9l6 6M15 9l-6 6" />
      <path d="M5 9v6h4l5 5V4l-5 5H5z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="icon"
    >
      <path d="M5 9v6h4l5 5V4l-5 5H5z" />
      <path d="M15 8.5a4.5 4.5 0 010 7" />
      <path d="M17.5 6a7 7 0 010 12" />
    </svg>
  )}
</button>

  );
}
