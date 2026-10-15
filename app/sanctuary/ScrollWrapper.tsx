"use client";

import ScrollCue from "./ScrollCue";
import { useScrollProgress } from "./useScrollProgress";

export default function ScrollWrapper({ children }) {
  const scrollProgress = useScrollProgress();

  return (
    <div className="scroll-wrapper">
      {children}
      <ScrollCue scrollProgress={scrollProgress} />
    </div>
  );
}
