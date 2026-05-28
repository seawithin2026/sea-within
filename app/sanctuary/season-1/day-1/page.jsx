"use client";

import { useState, useEffect, useRef } from "react";
import { useAudio } from "@/app/providers/AudioProvider";
import NarrationPlayer from "@/components/NarrationPlayer";
import { getDayScript } from "@/lib/voice/voiceConfig";
import "./day1.css";

// Narrator configs
const INTRO_VOICE = {
  volume: 0.5,
  playbackRate: 0.92,
  lineDelay: 6500,
};

const RITUAL_VOICE = {
  volume: 0.4,
  playbackRate: 0.98,
  lineDelay: 5000,
};

export default function Day1Page() {
  const [mode, setMode] = useState("intro");
  const { setAmbientMuted } = useAudio();

  // Scripts
  const intro = getDayScript("season1-day1-intro");
  const ritual = getDayScript("season1-day1-ritual");

  // ⭐ JSX-safe refs (no TypeScript)
  const introPlay = useRef(null);
  const ritualPlay = useRef(null);

  // ⭐ FIXED: "instant" is invalid → use "auto"
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setAmbientMuted(false);
  }, [setAmbientMuted]);

  const goToRitual = () => {
    setMode("ritual");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="day1">

      {/* HERO */}
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
            <p className="chamberSubtitle">A quiet descent into readiness.</p>

            <div className="narrationButtonWrapper">
              <button
                className="narrationButton"
                onClick={() => introPlay.current && introPlay.current()}
              >
                <span className="narrationDot"></span>
                <span className="narrationLabel">Play Narration</span>
              </button>
            </div>

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
            <p className="ritualLabel">Water Purification</p>

            {/* MAIN VIDEO */}
            <div className="ritualMainVideo">
              <video
                src="/video-season1/day1-water-purification.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="ritualMainVideoFile"
              />
              <p className="ritualMainCaption">
                Water Purification — a symbolic cleansing of what no longer serves you.
              </p>
            </div>

            {/* ITEM GRID */}
            <div className="itemSuggestionGrid">
              <div className="item">
                <video src="/items/petals.mp4" autoPlay muted loop playsInline />
                <p>Flower petals — beauty floating with you</p>
              </div>

              <div className="item">
                <video src="/items/led-candle.mp4" autoPlay muted loop playsInline />
                <p>Battery LED candle — safe, soft glow</p>
              </div>

              <div className="item">
                <video src="/items/bath-oil.mp4" autoPlay muted loop playsInline />
                <p>Bath oil — nourishment and softness</p>
              </div>

              <div className="item">
                <video src="/items/epsom-salt.mp4" autoPlay muted loop playsInline />
                <p>Epsom salt — release and purification</p>
              </div>

              <div className="item">
                <video src="/items/soft-cloth.mp4" autoPlay muted loop playsInline />
                <p>Soft cloth — gentle grounding</p>
              </div>

              <div className="item">
                <video src="/items/towel.mp4" autoPlay muted loop playsInline />
                <p>Towel — warmth for your return</p>
              </div>

              <div className="item">
                <video src="/items/bathrobe.mp4" autoPlay muted loop playsInline />
                <p>Bathrobe — comfort after cleansing</p>
              </div>

              <div className="item">
                <video src="/items/music.mp4" autoPlay muted loop playsInline />
                <p>Music — atmosphere for your ritual</p>
              </div>

              <div className="item">
                <video src="/items/calming-object.mp4" autoPlay muted loop playsInline />
                <p>Calming object — stone, shell, or meaning</p>
              </div>

              <div className="item">
                <video src="/items/moon-water.mp4" autoPlay muted loop playsInline />
                <p>Moon/Sun water — charged intention</p>
              </div>
            </div>

            {/* PLAY RITUAL NARRATION */}
            <div className="narrationButtonWrapper ritualPlayButton">
              <button
                className="narrationButton"
                onClick={() => ritualPlay.current && ritualPlay.current()}
              >
                <span className="narrationDot"></span>
                <span className="narrationLabel">Play Ritual Narration</span>
              </button>
            </div>

            {/* RITUAL VIDEO */}
            <div className="ritualClip">
              <video
                src="/video-season1/day1-ritual.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
              <p className="ritualClipCaption">
                Let the water hold every burden, every old story, every pain that no longer belongs to you.
              </p>
              <p className="ritualClipCaption">
                When you rise, you rise into a new beginning — one chosen by you, for you.
              </p>
            </div>

            {/* TEXT REVEAL */}
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

            {/* FINAL MESSAGE */}
            <div className="ritualFinalMessage">
              <p>
                View this once. Then put the screen away.  
                Create your own version of this ritual — in your own timing, in your own way.  
                This is symbolic: a release of what no longer serves you, and a quiet honoring of your new beginning.
              </p>
            </div>
          </div>

          <div className="ritualBackground" />
        </section>
      )}
    </div>
  );
}
