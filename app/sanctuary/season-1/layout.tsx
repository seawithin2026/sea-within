"use client";

import ScrollCue from "../ScrollCue";
import { useScrollProgress } from "../useScrollProgress";

export default function Season1Layout({ children }) {
  const scrollProgress = useScrollProgress();

  return (
    <div className="season1-layout">
      {children}
      <ScrollCue scrollProgress={scrollProgress} />
    </div>
  );
}
