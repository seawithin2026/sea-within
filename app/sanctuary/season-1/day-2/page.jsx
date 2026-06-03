"use client";
import "./day2.css";

export default function Day2Page() {
  return (
    <div className="day2-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO (LIKE DAY 1) */}
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

        <div className="day2-hero-overlay">
          <p className="day2-hero-tag">SEA WITHIN · DAY 2</p>
          <h1 className="day2-hero-title">The Triple Flame</h1>
          <p className="day2-hero-subtitle">Fire · Sea · Earth</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Today, the Triple Flame rises within you.</span>
        <span>The Fire that transforms.</span>
        <span>The Sea that remembers.</span>
        <span>The Earth that holds you steady.</span>
        <span className="mt">Three powers. One self.</span>
        <span>This is the moment you begin to feel like yourself again.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ELEMENTAL GRID (KEPT EXACTLY AS YOU LIKE IT) */}
      {/* -------------------------------------------------- */}
      <section className="day2-grid">

        {/* FIRE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day2-fire.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE FIRE WITHIN</p>
          <p className="grid-text">The spark that rises when you remember who you are.</p>

          <div className="element-paragraph">
            <p>Bring your hand to your heart. Feel the warmth beneath your skin.</p>
            <p>Here is your Fire.</p>
            <p>The spark that never died, even when you dimmed yourself.</p>
            <p>The part of you that knows exactly who you are becoming.</p>
            <p>Let it rise. Let it speak. Let it burn clean.</p>
          </div>
        </div>

        {/* SEA */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day2-sea.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE SEA WITHIN</p>
          <p className="grid-text">The depth that steadies you when the world feels loud.</p>

          <div className="element-paragraph">
            <p>Touch your stomach. Breathe into the softness.</p>
            <p>Here is your Sea.</p>
            <p>The quiet depth beneath your emotions.</p>
            <p>The movement inside you that never lies.</p>
            <p>The water that holds your memory without judgment.</p>
            <p>Let it steady you. Let it clear you. Let it bring you back to your center.</p>
          </div>
        </div>

        {/* EARTH */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day2-earth.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE EARTH WITHIN</p>
          <p className="grid-text">The ground that holds you steady as you rise.</p>

          <div className="element-paragraph">
            <p>Place your feet firmly on the ground.</p>
            <p>Here is your Earth.</p>
            <p>The strength beneath your tenderness.</p>
            <p>The ground that has carried you through every ending.</p>
            <p>Let it root you. Let it steady you. Let it hold your becoming.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are becoming.</span>
        <span>Return tomorrow.</span>
        <span>The journey continues.</span>
      </footer>

    </div>
  );
}
