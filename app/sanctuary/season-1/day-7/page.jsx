"use client";
import "./day7.css";

export default function Day7Page() {
  return (
    <div className="day7-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day7-hero">
        <video
  src="/video-season1/day-7.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="day7-hero-video"
  onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.6)}
/>


        <div className="day7-hero-text">
          <p className="day7-hero-tag">SEA WITHIN · DAY 7</p>
          <h1 className="day7-hero-title">The Wind Ritual</h1>
          <p className="day7-hero-subtitle">The messenger of change.</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING TEXT */}
      {/* -------------------------------------------------- */}
      <section className="cinematic-opening">
        <span>The wind does not ask.</span>
        <span>It arrives. It clears. It carries.</span>

        <span className="mt">
          Today, you let the wind move through you the way it has moved through
          mountains, oceans, and every ancestor before you.
        </span>

        <span className="mt">Let it touch your skin.</span>
        <span>Let it speak through you.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. THREE ANCIENT WIND TECHNIQUES */}
      {/* -------------------------------------------------- */}
      <section className="day7-grid">

        {/* Technique 1 — Skin Listening */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.6)}>
              <source src="/video-season1/day7-skin-listening.mp4" />
            </video>
          </div>

          <p className="grid-title">Skin Listening</p>
          <p className="grid-text">The nomadic technique of reading the world through sensation.</p>

          <div className="element-paragraph">
            <p>Turn your face toward the wind.</p>
            <p>Feel it touch your cheeks, your jaw, your throat.</p>
            <p>This is how ancient travelers sensed direction — with their skin.</p>
          </div>
        </div>

        {/* Technique 2 — Exhale of Release */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.5)}>
              <source src="/video-season1/day7-release.mp4" />
            </video>
          </div>

          <p className="grid-title">Exhale of Release</p>
          <p className="grid-text">The desert method of letting the wind carry what you no longer hold.</p>

          <div className="element-paragraph">
            <p>Exhale into the wind.</p>
            <p>Let it take what your body is ready to release.</p>
            <p>This is how desert people softened grief — by giving it to the wind.</p>
          </div>
        </div>

        {/* Technique 3 — Four Winds Turning */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}>
              <source src="/video-season1/day7-four-winds.mp4" />
            </video>
          </div>

          <p className="grid-title">Four Winds Turning</p>
          <p className="grid-text">The mountain ritual of awakening through direction.</p>

          <div className="element-paragraph">
            <p>Turn slowly to each direction.</p>
            <p>East — awakening. South — warmth.</p>
            <p>West — release. North — strength.</p>
            <p>You are standing in the crossroads of the world.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>The wind has touched you.</span>
        <span>The world has moved through you.</span>
        <span>You are being carried forward.</span>
        <span>Return tomorrow.</span>
      </footer>

    </div>
  );
}
