"use client";
import "./day10.css";

export default function Day10Page() {
  return (
    <div className="day10-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day10-hero">
        <video
          src="/video-season1/day-10.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day10-hero-video"
        />

        <div className="day10-hero-text">
          <p className="day10-hero-tag">SEA WITHIN · DAY 10</p>
          <h1 className="day10-hero-title">The Stillness Ritual</h1>
          <p className="day10-hero-subtitle">Where the world stops, and you begin.</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING TEXT */}
      {/* -------------------------------------------------- */}
      <section className="cinematic-opening">
        <span>There is a kind of stillness that is not quiet.</span>
        <span>Not empty. Not passive.</span>

        <span className="mt">
          It is the stillness beneath movement.  
          The stillness inside breath.  
          The doorway ancient practitioners called the real self.
        </span>

        <span className="mt">Today, you enter that doorway.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. THREE STILLNESS ELEMENTS */}
      {/* -------------------------------------------------- */}
      <section className="day10-grid">

        {/* Element 1 — The Stone Seat */}
        <div className="grid-element">
          <div className="grid-media">
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}
            >
              <source src="/video-season1/day10-stone-seat.mp4" />
            </video>
          </div>

          <p className="grid-title">The Stone Seat</p>
          <p className="grid-text">The mountain way of becoming heavier than thought.</p>

          <div className="element-paragraph">
            <p>Sit as the mountains sat.</p>
            <p>Heavy. Rooted. Unmoving.</p>
            <p>Let your weight drop into the earth.</p>
            <p>This is how clarity begins — with stillness deeper than mind.</p>
          </div>
        </div>

        {/* Element 2 — The Inner Lake */}
        <div className="grid-element">
          <div className="grid-media">
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}
            >
              <source src="/video-season1/day10-inner-lake.mp4" />
            </video>
          </div>

          <p className="grid-title">The Inner Lake</p>
          <p className="grid-text">The water-mystic practice of letting the surface settle.</p>

          <div className="element-paragraph">
            <p>Close your eyes.</p>
            <p>Imagine your chest as a lake at dawn.</p>
            <p>No ripples. No wind. Just depth.</p>
            <p>When the surface stills, the bottom becomes visible.</p>
          </div>
        </div>

        {/* Element 3 — The Silent Pulse */}
        <div className="grid-element">
          <div className="grid-media">
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}
            >
              <source src="/video-season1/day10-silent-pulse.mp4" />
            </video>
          </div>

          <p className="grid-title">The Silent Pulse</p>
          <p className="grid-text">The breath-keeper method of meeting the self between beats.</p>

          <div className="element-paragraph">
            <p>Place two fingers on your pulse.</p>
            <p>Feel the quiet rhythm beneath your skin.</p>
            <p>This is the oldest sound in your body.</p>
            <p>Sit with it. Let it speak.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>Stillness is not the absence of movement.</span>
        <span>It is the presence of yourself.</span>
        <span>You have entered the doorway.</span>
        <span>Return tomorrow.</span>
      </footer>

    </div>
  );
}
