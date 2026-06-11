"use client";
import "./day8.css";

export default function Day8Page() {
  return (
    <div className="day8-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day8-hero">
        <video
          src="/video-season1/day-8.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day8-hero-video"
        />

        <div className="day8-hero-text">
          <p className="day8-hero-tag">SEA WITHIN · DAY 8</p>
          <h1 className="day8-hero-title">The Shadow Ritual</h1>
          <p className="day8-hero-subtitle">Meeting the quiet within.</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING TEXT */}
      {/* -------------------------------------------------- */}
      <section className="cinematic-opening">
        <span>Every light casts a shadow.</span>
        <span>Every human carries one.</span>

        <span className="mt">
          Today, you step into the soft shade — not to hide, but to meet the
          parts of you that whisper instead of shout.
        </span>

        <span className="mt">This is not darkness.</span>
        <span>This is depth.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. THREE ANCIENT SHADOW TECHNIQUES */}
      {/* -------------------------------------------------- */}
      <section className="day8-grid">

        {/* Technique 1 — Cool-Skin Descent */}
        <div className="grid-element">
          <div className="grid-media">
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}
            >
              <source src="/video-season1/day8-cool-skin.mp4" />
            </video>
          </div>

          <p className="grid-title">Cool-Skin Descent</p>
          <p className="grid-text">The forest technique of entering the inner world.</p>

          <div className="element-paragraph">
            <p>Step into the shade.</p>
            <p>Feel the temperature drop on your skin.</p>
            <p>This is how forest mystics entered themselves — through coolness.</p>
          </div>
        </div>

        {/* Technique 2 — The Shadow Seat */}
        <div className="grid-element">
          <div className="grid-media">
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}
            >
              <source src="/video-season1/day8-shadow-seat.mp4" />
            </video>
          </div>

          <p className="grid-title">The Shadow Seat</p>
          <p className="grid-text">The monastic practice of meeting truth through stillness.</p>

          <div className="element-paragraph">
            <p>Sit. Let your weight drop.</p>
            <p>Feel the quiet gather around you.</p>
            <p>This is how monks met their truth — by sitting long enough for it to rise.</p>
          </div>
        </div>

        {/* Technique 3 — The Gentle Witness */}
        <div className="grid-element">
          <div className="grid-media">
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}
            >
              <source src="/video-season1/day8-witness.mp4" />
            </video>
          </div>

          <p className="grid-title">The Gentle Witness</p>
          <p className="grid-text">The ancestral method of softening the unseen self.</p>

          <div className="element-paragraph">
            <p>Place a hand on your chest.</p>
            <p>Feel whatever rises — warmth, ache, memory, nothing at all.</p>
            <p>Do not fix it. Do not fight it. Witness it.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>The shade has held you.</span>
        <span>Your truth has risen.</span>
        <span>You have met the quiet within.</span>
        <span>Return tomorrow.</span>
      </footer>

    </div>
  );
}
