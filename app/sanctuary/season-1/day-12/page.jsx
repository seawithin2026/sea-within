"use client";
import "./day12.css";

export default function Day12Page() {
  return (
    <div className="day12-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day12-hero">
        <video
          src="/video-season1/day-12.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day12-hero-video"
          onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}
        />

        <div className="day12-hero-text">
          <p className="day12-hero-tag">SEA WITHIN · DAY 12</p>
          <h1 className="day12-hero-title">The Qi Cultivation Ritual</h1>
          <p className="day12-hero-subtitle">Gathering life-force.</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING TEXT */}
      {/* -------------------------------------------------- */}
      <section className="cinematic-opening">
        <span>Qi is the movement beneath movement.</span>
        <span>The breath beneath breath.</span>

        <span className="mt">
          It is the subtle current ancient practitioners spent lifetimes learning to feel.
        </span>

        <span className="mt">Today, you begin to gather it.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. THREE ELEMENTS */}
      {/* -------------------------------------------------- */}
      <section className="day12-grid">

        {/* Element 1 — Lower Dantian Breath */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}>
              <source src="/video-season1/day12-dantian.mp4" />
            </video>
          </div>

          <p className="grid-title">The Lower Dantian Breath</p>
          <p className="grid-text">The ancient center of energy storage.</p>

          <div className="element-paragraph">
            <p>Place your hand below your navel.</p>
            <p>Breathe into your palm.</p>
            <p>Feel the belly expand and the warmth gather.</p>
            <p>The center awakens.</p>
          </div>
        </div>

        {/* Element 2 — The Rising Current */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}>
              <source src="/video-season1/day12-rising-current.mp4" />
            </video>
          </div>

          <p className="grid-title">The Rising Current</p>
          <p className="grid-text">The upward flow of cultivated energy.</p>

          <div className="element-paragraph">
            <p>With each inhale, feel the warmth rise.</p>
            <p>From belly to chest to throat.</p>
            <p>This is the ancient path of Qi.</p>
            <p>Rising like morning light.</p>
          </div>
        </div>

        {/* Element 3 — The Circling Flow */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}>
              <source src="/video-season1/day12-circling-flow.mp4" />
            </video>
          </div>

          <p className="grid-title">The Circling Flow</p>
          <p className="grid-text">The loop that completes the energy cycle.</p>

          <div className="element-paragraph">
            <p>Imagine the warmth moving down your spine as you exhale.</p>
            <p>Rising on the inhale.</p>
            <p>Circling on the exhale.</p>
            <p>This is how Qi becomes steady.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>Your energy has gathered.</span>
        <span>Your current has risen.</span>
        <span>Your circle has begun.</span>
        <span>Return tomorrow.</span>
      </footer>

    </div>
  );
}
