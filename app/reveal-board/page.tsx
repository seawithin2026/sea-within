"use client";

import React, { useState, useEffect } from "react";

export default function RevealBoard() {
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [doorOpen, setDoorOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const messages = [
    {
      id: 1,
      country: "Canada",
      date: "2026-05-09",
      time: "00:21",
      text: "Even in the deepest water, your breath is a lantern.",
    },
    {
      id: 2,
      country: "France",
      date: "2026-05-08",
      time: "22:03",
      text: "You are not late. The tide always returns to the shore it loves.",
    },
    {
      id: 3,
      country: "Brazil",
      date: "2026-05-07",
      time: "14:47",
      text: "What you call breaking is often just the shell of an old self falling away.",
    },
  ];

  const keys = [
    { id: 1, label: "Key of Tides", metal: "gold" },
    { id: 2, label: "Key of Echoes", metal: "silver" },
    { id: 3, label: "Key of Depth", metal: "obsidian" },
  ];

  const metalColors: any = {
    gold: "from-yellow-300 to-amber-600",
    silver: "from-gray-200 to-gray-500",
    obsidian: "from-gray-800 to-black",
  };

  const handleKeyClick = (id: number) => {
    setSelectedKey(id);
    setDoorOpen(false);
    setShowMessage(false);

    setTimeout(() => setDoorOpen(true), 600);
    setTimeout(() => setShowMessage(true), 1600);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pb-20">
      {/* HERO VIDEO */}
      <div className="w-full max-w-4xl mt-10 rounded-3xl overflow-hidden shadow-2xl relative">
        <video
          src="https://cdn.pixabay.com/video/2024/03/26/206421_large.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-300">
            Sea Within
          </p>
          <h1 className="text-3xl font-light">Reveal Board</h1>
        </div>
      </div>

      {/* KEYS */}
      <h2 className="mt-12 text-sm tracking-[0.3em] uppercase text-gray-400">
        Choose Your Key
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
        {keys.map((key) => (
          <button
            key={key.id}
            onClick={() => handleKeyClick(key.id)}
            className={`p-6 rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-gray-700 hover:border-cyan-400 transition-all duration-300 hover:-translate-y-1 ${
              selectedKey === key.id ? "border-cyan-400 shadow-cyan-400/40" : ""
            }`}
          >
            <div
              className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${metalColors[key.metal]} shadow-xl`}
            />
            <p className="mt-4 text-xs tracking-[0.2em] uppercase text-gray-400">
              {key.label}
            </p>
          </button>
        ))}
      </div>

      {/* DOOR + MESSAGE */}
      <div className="w-full max-w-4xl mt-16 p-10 rounded-3xl bg-gradient-to-b from-gray-950 to-black border border-gray-800 shadow-2xl relative overflow-hidden">
        {/* Door */}
        <div
          className={`w-48 h-72 mx-auto rounded-2xl bg-gradient-to-b from-gray-800 to-black border border-gray-700 shadow-xl transition-transform duration-[1200ms] origin-left ${
            doorOpen ? "rotate-y-[-25deg]" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        />

        {/* Message */}
        {selectedKey && (
          <div
            className={`mt-10 text-center transition-opacity duration-700 ${
              showMessage ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-cyan-300 mb-3">
              Anonymous — {messages[selectedKey - 1].country} —{" "}
              {messages[selectedKey - 1].date} —{" "}
              {messages[selectedKey - 1].time}
            </p>

            <h3 className="text-xl font-light mb-3">Wisdom Message</h3>

            <p className="text-gray-200 max-w-md mx-auto leading-relaxed">
              {messages[selectedKey - 1].text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
