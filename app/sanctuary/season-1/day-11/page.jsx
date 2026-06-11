"use client";
import "./day11.css";

export default function Day11Page() {
  return (
    <div className="day11-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day11-hero">
        <video
          src="/video-season1/day-11.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day11-hero-video"
          onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}
        />

        <div className="day11-hero-text">
          <p className="day11-hero-tag">SEA WITHIN · DAY 11</p>
          <h1 className="day11-hero-title">The Cold Water Ritual</h1>
          <p className="day11-hero-subtitle">Awakening through contrast.</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING TEXT */}
      {/* -------------------------------------------------- */}
      <section className="cinematic-opening">
        <span>Cold is not an enemy.</span>
        <span>Cold is a teacher.</span>

        <span className="mt">
          It sharpens the mind.  
          It awakens the body.  
          It reveals the strength that warmth hides.
        </span>

        <span className="mt">Today, you meet the cold.</span>
        <span>Not to endure it — but to remember yourself inside it.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. THREE ELEMENTS */}
      {/* -------------------------------------------------- */}
      <section className="day11-grid">

        {/* Element 1 — The First Touch */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}>
              <source src="/video-season1/day11-first-touch.mp4" />
            </video>
          </div>

          <p className="grid-title">The First Touch</p>
          <p className="grid-text">The ancient way of greeting the cold.</p>

          <div className="element-paragraph">
            <p>Place your hands in the water.</p>
            <p>Feel the shock. Feel the breath catch.</p>
            <p>Do not pull away.</p>
            <p>This is the moment ancient practitioners called the awakening.</p>
          </div>
        </div>

        {/* Element 2 — The Descent */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}>
              <source src="/video-season1/day11-descent.mp4" />
            </video>
          </div>

          <p className="grid-title">The Descent</p>
          <p className="grid-text">The body’s surrender into clarity.</p>

          <div className="element-paragraph">
            <p>Lower your arms into the water.</p>
            <p>Let the cold climb your skin.</p>
            <p>Do not fight it. Do not brace.</p>
            <p>Let your breath widen around the sensation.</p>
          </div>
        </div>

        {/* Element 3 — The Inner Heat */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}>
              <source src="/video-season1/day11-inner-heat.mp4" />
            </video>
          </div>

          <p className="grid-title">The Inner Heat</p>
          <p className="grid-text">The fire that rises when the cold arrives.</p>

          <div className="element-paragraph">
            <p>Feel the warmth inside your chest.</p>
            <p>The cold does not extinguish it — it reveals it.</p>
            <p>This is the inner fire ancient practitioners trusted.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>Cold has touched you.</span>
        <span>Heat has risen within you.</span>
        <span>You have remembered your strength.</span>
        <span>Return tomorrow.</span>
      </footer>

    </div>
  );
}
