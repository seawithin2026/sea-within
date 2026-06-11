"use client";
import "./day9.css";

export default function Day9Page() {
  return (
    <div className="day9-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day9-hero">
        <video
          src="/video-season1/day-9.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day9-hero-video"
        />

        <div className="day9-hero-text">
          <p className="day9-hero-tag">SEA WITHIN · DAY 9</p>
          <h1 className="day9-hero-title">The Heart‑Fire Ritual</h1>
          <p className="day9-hero-subtitle">Igniting inner purpose.</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING TEXT */}
      {/* -------------------------------------------------- */}
      <section className="cinematic-opening">
        <span>You have gathered water, breath, earth, and sun.</span>
        <span>Now the fire inside you wakes.</span>

        <span className="mt">
          Today, you breathe life into the ember that has lived in your chest
          since the moment you were born.
        </span>

        <span className="mt">Not a blaze.</span>
        <span>A steady, sovereign fire.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. THREE ANCIENT HEART-FIRE TECHNIQUES */}
      {/* -------------------------------------------------- */}
      <section className="day9-grid">

        {/* Technique 1 — Palm-Flame */}
        <div className="grid-element">
          <div className="grid-media">
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}
            >
              <source src="/video-season1/day9-palm-flame.mp4" />
            </video>
          </div>

          <p className="grid-title">Palm‑Flame</p>
          <p className="grid-text">The warrior method of awakening courage.</p>

          <div className="element-paragraph">
            <p>Place your hand on your chest.</p>
            <p>Feel the warmth beneath your palm.</p>
            <p>This is how warriors found their fire — by touching it.</p>
          </div>
        </div>

        {/* Technique 2 — Breath-Bellows */}
        <div className="grid-element">
          <div className="grid-media">
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}
            >
              <source src="/video-season1/day9-bellows.mp4" />
            </video>
          </div>

          <p className="grid-title">Breath‑Bellows</p>
          <p className="grid-text">The fire‑keeper technique of feeding inner heat.</p>

          <div className="element-paragraph">
            <p>Inhale deeply.</p>
            <p>Exhale slowly.</p>
            <p>Let each breath feed the ember in your chest.</p>
          </div>
        </div>

        {/* Technique 3 — Inner Flame Stand */}
        <div className="grid-element">
          <div className="grid-media">
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}
            >
              <source src="/video-season1/day9-inner-flame.mp4" />
            </video>
          </div>

          <p className="grid-title">Inner Flame Stand</p>
          <p className="grid-text">The sun‑line ritual of rising into purpose.</p>

          <div className="element-paragraph">
            <p>Stand tall. Let your spine lengthen.</p>
            <p>Feel the warmth rise through your ribs, throat, and face.</p>
            <p>This is how ancient tribes called their purpose — by rising with their fire.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>Your fire has awakened.</span>
        <span>Your purpose is stirring.</span>
        <span>You are becoming yourself.</span>
        <span>Return tomorrow.</span>
      </footer>

    </div>
  );
}
