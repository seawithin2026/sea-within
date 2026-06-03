"use client";
import { useState } from "react";
import "./day2.css";

export default function Day2Page() {
  const [fire, setFire] = useState(false);
  const [water, setWater] = useState(false);
  const [earth, setEarth] = useState(false);

  const [showTripleFlameVideo, setShowTripleFlameVideo] = useState(false);

  const allActive = fire && water && earth;

  const activate = (setter) => setter(true);

  const unify = () => {
    setFire(true);
    setWater(true);
    setEarth(true);
  };

  return (
    <div
      className={`day2-page 
        ${fire ? "fire-active" : ""} 
        ${water ? "water-active" : ""} 
        ${earth ? "earth-active" : ""} 
        ${allActive ? "unified" : ""}`}
    >

      {/* -------------------------------------------------- */}
      {/* 1. CINEMATIC HERO (NO CIRCLE OVERLAY) */}
      {/* -------------------------------------------------- */}
      <section className="day2-hero">
        <video
          src="/video-season1/day-2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day2-hero-video"
        />
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. CINEMATIC OPENING TEXT (LIKE DAY 1) */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Today, the Triple Flame rises within you.</span>
        <span>The Fire that transforms.</span>
        <span>The Sea that remembers.</span>
        <span>The Earth that holds you steady.</span>
        <span className="mt">Three powers. One self.</span>
        <span>This is the moment you begin to become.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ACTIVATION BUTTON (CLEAN + CENTERED) */}
      {/* -------------------------------------------------- */}
      <section className="activation-block">
        <button
          className="btn btn-main"
          onClick={() => {
            unify();
            setShowTripleFlameVideo(true);
          }}
        >
          Awaken the Triple Flame
        </button>
      </section>

      {/* -------------------------------------------------- */}
      {/* 4. ORIGINAL GRID (UNCHANGED) */}
      {/* -------------------------------------------------- */}
      <section className="day2-grid">

        {/* FIRE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day2-fire.mp4" />
            </video>
          </div>
          <p className="grid-title">The Fire Within</p>
          <p className="grid-text">The spark that rises when you remember who you are.</p>
        </div>

        {/* SEA */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day2-sea.mp4" />
            </video>
          </div>
          <p className="grid-title">The Sea Within</p>
          <p className="grid-text">The depth that steadies you when the world feels loud.</p>
        </div>

        {/* EARTH */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day2-earth.mp4" />
            </video>
          </div>
          <p className="grid-title">The Earth Within</p>
          <p className="grid-text">The ground that holds you steady as you rise.</p>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 5. ORIGINAL RITUAL SECTIONS (UNCHANGED) */}
      {/* -------------------------------------------------- */}
      <section className="sections">

        {/* FIRE */}
        <article className={`section ${fire ? "pulse" : ""}`}>
          <div className="section-label">Aspect I</div>
          <div className="section-title fire">The Fire Within</div>
          <p className="section-instruction">
            Bring your hand to your heart. Feel the warmth beneath your skin.
          </p>
          <p className="section-text">
            <span>Here is your Fire.</span>
            <span>The spark that never died, even when you dimmed yourself.</span>
            <span>The part of you that knows exactly who you are becoming.</span>
            <span>Let it rise. Let it speak. Let it burn clean.</span>
          </p>
          <button className="btn btn-fire" onClick={() => activate(setFire)}>
            <span className="dot"></span>
            Ignite
          </button>
        </article>

        {/* SEA */}
        <article className={`section ${water ? "pulse" : ""}`}>
          <div className="section-label">Aspect II</div>
          <div className="section-title water">The Sea Within</div>
          <p className="section-instruction">
            Touch your stomach. Breathe into the softness.
          </p>
          <p className="section-text">
            <span>Here is your Sea.</span>
            <span>The quiet depth beneath your emotions.</span>
            <span>The movement inside you that never lies.</span>
            <span>The water that holds your memory without judgment.</span>
            <span>Let it steady you. Let it clear you. Let it bring you back to your center.</span>
          </p>
          <button className="btn btn-water" onClick={() => activate(setWater)}>
            <span className="dot"></span>
            Let It Flow
          </button>
        </article>

        {/* EARTH */}
        <article className={`section ${earth ? "pulse" : ""}`}>
          <div className="section-label">Aspect III</div>
          <div className="section-title earth">The Earth Within</div>
          <p className="section-instruction">
            Place your feet firmly on the ground.
          </p>
          <p className="section-text">
            <span>Here is your Earth.</span>
            <span>The strength beneath your tenderness.</span>
            <span>The ground that has carried you through every ending.</span>
            <span>Let it root you. Let it steady you. Let it hold your becoming.</span>
          </p>
          <button className="btn btn-earth" onClick={() => activate(setEarth)}>
            <span className="dot"></span>
            Root Me
          </button>
        </article>

      </section>

      {/* -------------------------------------------------- */}
      {/* 6. UNIFICATION (UNCHANGED) */}
      {/* -------------------------------------------------- */}
      <section className="unification">
        <span>Fire to awaken you.</span>
        <span>Sea to clear you.</span>
        <span>Earth to protect you.</span>
        <span className="mt">Three powers rising.</span>
        <span>One self returning.</span>
        <span className="mt">Today, you awaken the Triple Flame.</span>
        <span>Today, you awaken the Sea Within.</span>

        <div className="unification-symbol"></div>

        <button
          className="btn btn-main"
          onClick={() => {
            unify();
            setShowTripleFlameVideo(true);
          }}
        >
          Awaken the Triple Flame
        </button>
      </section>

      <footer className="closing">
        <span>You are becoming.</span>
        <span>Return tomorrow.</span>
        <span>The journey continues.</span>
      </footer>

      {/* -------------------------------------------------- */}
      {/* 7. CINEMATIC VIDEO MODAL */}
      {/* -------------------------------------------------- */}
      {showTripleFlameVideo && (
        <div className="tripleFlameModal">
          <div className="tripleFlameModalContent">
            <video autoPlay muted playsInline className="tripleFlameVideo">
              <source src="/video-season1/day2-triple-flame.mp4" type="video/mp4" />
            </video>

            <button
              className="closeTripleFlame"
              onClick={() => setShowTripleFlameVideo(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
