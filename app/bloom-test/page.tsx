"use client";

import { useState } from "react";
import { BloomReveal } from "@/components/bloom/BloomReveal";

const ELEMENTS = ["water", "fire", "earth", "air", "light", "shadow"];

const VIDEOS = [
  { id: "bloom-01", src: "/bloom-videos/bloom-01.mp4" },
  { id: "bloom-02", src: "/bloom-videos/bloom-02.mp4" },
  { id: "bloom-03", src: "/bloom-videos/bloom-03.mp4" },
];

export default function BloomTestPage() {
  const [earned, setEarned] = useState(true);
  const [level, setLevel] = useState(1);
  const [element, setElement] = useState("water");
  const [videoId, setVideoId] = useState("bloom-01");
  const [simulateSlow, setSimulateSlow] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [corruptStill, setCorruptStill] = useState(false);

  const selectedVideo = VIDEOS.find((v) => v.id === videoId)!;

  const mockBloomVideo = {
    id: selectedVideo.id,
    src: selectedVideo.src,
    title: `Test Bloom (${element})`,
    level,
    element,
  };

  async function handleSave(id: string) {
    if (simulateError) {
      console.error("Simulated save error");
      return;
    }

    if (simulateSlow) {
      await new Promise((res) => setTimeout(res, 2000));
    }

    console.log("Saved bloom:", id);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 bg-slate-950 p-10 text-white">
      <h1 className="text-2xl tracking-[0.2em] uppercase text-white/80">
        BloomReveal Lab
      </h1>

      {/* CONTROL PANEL */}
      <div className="w-full max-w-xl p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex flex-col gap-6">
        
        {/* Earned Toggle */}
        <ControlRow label="Earned">
          <ToggleButton value={earned} onChange={() => setEarned(!earned)} />
        </ControlRow>

        {/* Level Selector */}
        <ControlRow label="Level">
          <select
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="control-select"
          >
            {[1, 2, 3, 4].map((lvl) => (
              <option key={lvl} value={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </ControlRow>

        {/* Element Selector */}
        <ControlRow label="Element">
          <select
            value={element}
            onChange={(e) => setElement(e.target.value)}
            className="control-select"
          >
            {ELEMENTS.map((el) => (
              <option key={el} value={el}>
                {el}
              </option>
            ))}
          </select>
        </ControlRow>

        {/* Video Selector */}
        <ControlRow label="Video">
          <select
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            className="control-select"
          >
            {VIDEOS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id}
              </option>
            ))}
          </select>
        </ControlRow>

        {/* Simulate Slow Network */}
        <ControlRow label="Simulate Slow Save">
          <ToggleButton value={simulateSlow} onChange={() => setSimulateSlow(!simulateSlow)} />
        </ControlRow>

        {/* Simulate Save Error */}
        <ControlRow label="Simulate Save Error">
          <ToggleButton value={simulateError} onChange={() => setSimulateError(!simulateError)} />
        </ControlRow>

        {/* Corrupt Still Frame */}
        <ControlRow label="Corrupt Still Frame">
          <ToggleButton value={corruptStill} onChange={() => setCorruptStill(!corruptStill)} />
        </ControlRow>

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
          onSaved={handleSave}
        />
      </div>
    </main>
  );
}

/* ----------------- SMALL COMPONENTS ----------------- */

function ControlRow({ label, children }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm tracking-wide">{label}</span>
      {children}
    </div>
  );
}

function ToggleButton({ value, onChange }: any) {
  return (
    <button
      onClick={onChange}
      className={`px-4 py-1 rounded-full text-sm border ${
        value
          ? "bg-green-600/40 border-green-400/40"
          : "bg-red-600/40 border-red-400/40"
      }`}
    >
      {value ? "On" : "Off"}
    </button>
  );
}
