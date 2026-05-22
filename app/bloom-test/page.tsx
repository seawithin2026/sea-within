"use client";

import { useState } from "react";
import { BloomReveal } from "@/components/bloom/BloomReveal";

const ELEMENTS = ["water", "fire", "earth", "air", "light", "shadow"];

export default function BloomTestPage() {
  const [earned, setEarned] = useState(true);
  const [level, setLevel] = useState(1);
  const [element, setElement] = useState("water");

  const mockBloomVideo = {
    id: "mock-bloom-01",
    src: "/bloom-videos/bloom-01.mp4",
    title: `Test Bloom (${element})`,
    level,
    element,
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 bg-slate-950 p-10 text-white">
      <h1 className="text-2xl tracking-[0.2em] uppercase text-white/80">
        BloomReveal Test Harness
      </h1>

      {/* CONTROL PANEL */}
      <div className="w-full max-w-xl p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex flex-col gap-6">
        {/* Earned Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm tracking-wide">Earned</span>
          <button
            onClick={() => setEarned(!earned)}
            className={`px-4 py-1 rounded-full text-sm border ${
              earned
                ? "bg-green-600/40 border-green-400/40"
                : "bg-red-600/40 border-red-400/40"
            }`}
          >
            {earned ? "Yes" : "No"}
          </button>
        </div>

        {/* Level Selector */}
        <div className="flex items-center justify-between">
          <span className="text-sm tracking-wide">Level</span>
          <select
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="bg-black/40 border border-white/20 rounded px-3 py-1 text-sm"
          >
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
            <option value={4}>Level 4</option>
          </select>
        </div>

        {/* Element Selector */}
        <div className="flex items-center justify-between">
          <span className="text-sm tracking-wide">Element</span>
          <select
            value={element}
            onChange={(e) => setElement(e.target.value)}
            className="bg-black/40 border border-white/20 rounded px-3 py-1 text-sm"
          >
            {ELEMENTS.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
        </div>

        {/* Live Preview */}
        <div className="text-xs text-white/60 bg-black/30 p-3 rounded-lg border border-white/10">
          <pre>{JSON.stringify(mockBloomVideo, null, 2)}</pre>
        </div>
      </div>

      {/* BLOOM REVEAL */}
      <div className="w-full max-w-xl">
        <BloomReveal
          earned={earned}
          bloomVideo={mockBloomVideo}
          onSaved={(id) => console.log("Saved bloom:", id)}
        />
      </div>
    </main>
  );
}
