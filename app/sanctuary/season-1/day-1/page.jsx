"use client";

import { useState, useEffect, useRef } from "react";
import { useAudio } from "@/app/providers/AudioProvider";
import NarrationPlayer from "@/components/NarrationPlayer";
import { getDayScript } from "@/lib/voice/voiceConfig";
import SubmergedMemoryReveal from "@/components/SubmergedMemoryReveal/SubmergedMemoryReveal"; // ⭐ ADDED
import "./day1.css";

// PERFECT narrator configs for your voice
const INTRO_VOICE = {
  volume: 0.50,
  playbackRate: 0.92,
  lineDelay: 6500,
};

const RITUAL_VOICE = {
  volume: 0.40,
  playbackRate: 0.98,
  lineDelay: 5000,
};

export default function Day1Page() {
  const [mode, setMode] = useState("intro");

  // ⭐ ADDED — separate reveal states
  const [showRevealIntro, setShowRevealIntro] = useState(false);
  const [showRevealRitual, setShowRevealRitual] = useState(false);

  const { setAmbientMuted } = useAudio();

  // Pull correct audio + script
  const intro = getDayScript("season1-day1-intro");
  const ritual = getDayScript("season1-day1-ritual");

  // Refs for play functions
  const introPlay = useRef(() => {});
  const ritualPlay = useRef(() => {});

  // Always start at top + unmute ambient
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setAmbientMuted(false);
  }, [setAmbientMuted]);

  // Scroll to top when switching modes
  const goToRitual = () => {
    setMode("ritual");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // ⭐ ADDED — trigger intro reveal
  const handleIntroPlay = () => {
    introPlay.current();
    setShowRevealIntro(true);
  };

  // ⭐ ADDED — trigger ritual reveal
  const handleRitualPlay = () => {
    ritualPlay.current();
    setShowRevealRitual(true);
  };

  return (
    <div className="day1">

      {/* HERO — INTRO ONLY */}
      {mode === "intro" && (
        <section className="hero">
          <video
            src="/video-season1/day-1.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="heroVideo"
          />

          <div className="heroOverlay">
            <p className="heroSeason">Season 1 — Day 1</p>
            <h1 className="heroTitle">The Arrival</h1>
            <p className="heroTagline">A cinematic descent into yourself.</p>
          </div>
        </section>
      )}

      {/* INTRO SECTION */}
      {mode === "intro" && (
        <section className="chamber">
          <div className="chamberGlow" />

          <div className="chamberInner">
            <h2 className="chamberTitle">Pre‑Preparation</h2>
            <p className="chamberSubtitle">
              A quiet descent into readiness.
            </p>

            {/* PLAY INTRO NARRATION */}
            <div className="narrationButtonWrapper">
              <button
                className="narrationButton"
                onClick={handleIntroPlay} // ⭐ UPDATED
              >
                <span className="narrationDot"></span>
                <span className="narrationLabel">Play Narration</span>
              </button>
            </div>

            {/* ⭐ ADDED — INTRO CINEMATIC REVEAL */}
            {showRevealIntro && (
              <SubmergedMemoryReveal
                lines={[
                  "Settle into the quiet.",
                  "Let the noise of the world fall away.",
                  "This is the beginning of your descent.",
                  "A soft return to the place within you.",
                  "You are arriving."
                ]}
              />
            )}

            {/* ORIGINAL NARRATION PLAYER */}
            <div className="chamberLines">
              <NarrationPlayer
                audioSrc={intro.audio}
                script={intro.script}
                config={INTRO_VOICE}
                onReady={(fn) => {
                  introPlay.current = fn;
                }}
              />
            </div>

            {/* ENTER SANCTUARY → RITUAL */}
            <div className="narrationButtonWrapper">
              <button className="narrationButton" onClick={goToRitual}>
                <span className="narrationDot"></span>
                <span className="narrationLabel">Enter the Sanctuary</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* RITUAL SECTION */}
      {mode === "ritual" && (
        <section className="ritual">
          <div className="ritualContent">
            <p className="ritualLabel">The Descent</p>

            {/* BREATHING CIRCLE */}
            <div className="breathe">
              <div className="breatheCircle" />
              <p className="breatheText">Breathe with the rhythm</p>
            </div>

            {/* PLAY RITUAL NARRATION */}
            <div className="narrationButtonWrapper ritualPlayButton">
              <button
                className="narrationButton"
                onClick={handleRitualPlay} // ⭐ UPDATED
              >
                <span className="narrationDot"></span>
                <span className="narrationLabel">Play Narration</span>
              </button>
            </div>

            {/* ⭐ ADDED — RITUAL CINEMATIC REVEAL */}
            {showRevealRitual && (
              <SubmergedMemoryReveal
                lines={[
                  "Let your breath guide you downward.",
                  "Feel the body soften, layer by layer.",
                  "You are crossing a threshold within yourself.",
                  "The deeper you go, the clearer everything becomes.",
                  "Welcome to the Sanctuary."
                ]}
              />
            )}

            {/* ORIGINAL RITUAL NARRATION PLAYER */}
            <div className="ritualLines">
              <NarrationPlayer
                audioSrc={ritual.audio}
                script={ritual.script}
                config={RITUAL_VOICE}
                onReady={(fn) => {
                  ritualPlay.current = fn;
                }}
              />
            </div>
          </div>

          <div className="ritualBackground" />
        </section>
      )}
    </div>
  );
}
