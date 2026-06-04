"use client";
import "./day6.css";

export default function Day6Page() {
  return (
    <div className="day6-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO — NO OVERLAY */}
      {/* -------------------------------------------------- */}
      <section className="day6-hero">
        <video
          src="/video-season1/day-6.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day6-hero-video"
        />

        <div className="day6-hero-text">
          <p className="day6-hero-tag">SEA WITHIN · DAY 6</p>
          <h1 className="day6-hero-title">The Ancient Sun Greeting</h1>
          <p className="day6-hero-subtitle">A ritual of gathering energy through the body.</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING TEXT */}
      {/* -------------------------------------------------- */}
      <section className="cinematic-opening">
        <span>Long before language, long before ritual had names,</span>
        <span>humans greeted the sun.</span>
        <span className="mt">Not as a god.</span>
        <span>Not as a symbol.</span>
        <span className="mt">But as the first warmth that ever touched their skin.</span>
        <span>The first light that ever opened their eyes.</span>
        <span className="mt">Today, you stand in that lineage.</span>
        <span>Today, you greet the ancient sun.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. THREE ANCIENT SUN-GREETING TECHNIQUES */}
      {/* -------------------------------------------------- */}
      <section className="day6-grid">

        {/* Technique 1 */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day6-arrival.mp4" />
            </video>
          </div>

          <p className="grid-title">The Arrival</p>
          <p className="grid-text">The moment you let the world meet you.</p>

          <div className="element-paragraph">
            <p>Feel the air wrap around you.</p>
            <p>Feel the temperature settle on your skin.</p>
            <p>Don’t reach for the sun — let it reach for you.</p>
            <p>Let the light land on your face the way it has for every human who ever lived.</p>
            <p>This is the oldest greeting in the world.</p>
          </div>
        </div>

        {/* Technique 2 */}
        <div className="grid-element">
          <div className="grid-media">
            <video
  autoPlay
  muted
  loop
  playsInline
  onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}
>
  <source src="/video-season1/day6-gathering.mp4" />
</video>

          </div>

          <p className="grid-title">The Gathering</p>
          <p className="grid-text">The breath that pulls warmth deeper into the body.</p>

          <div className="element-paragraph">
            <p>Feel the warmth enter through your cheeks.</p>
            <p>Feel it slide down your throat.</p>
            <p>Feel it settle behind your sternum like a glowing seed.</p>
            <p>Your skin is drinking light.</p>
            <p>Your breath is pulling it deeper.</p>
          </div>
        </div>

        {/* Technique 3 */}
        <div className="grid-element">
          <div className="grid-media">
             <video
  autoPlay
  muted
  loop
  playsInline
  onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}
  >
              <source src="/video-season1/day6-expansion.mp4" />
            </video>
          </div>

          <p className="grid-title">The Expansion</p>
          <p className="grid-text">The warmth that moves through the body on its own.</p>

          <div className="element-paragraph">
            <p>With each breath, feel the warmth shift.</p>
            <p>Maybe it spreads across your chest.</p>
            <p>Maybe it tingles in your hands.</p>
            <p>Maybe it hums low in your belly.</p>
            <p>You are not imagining light — you are absorbing it.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>The sun has touched you.</span>
        <span>The earth has held you.</span>
        <span>Your body has gathered what it was ready to receive.</span>
        <span>Return tomorrow.</span>
      </footer>

    </div>
  );
}
