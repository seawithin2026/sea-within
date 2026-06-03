"use client";
import "./day5.css";

export default function Day5Page() {
  return (
    <div className="day5-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO — NO OVERLAY */}
      {/* -------------------------------------------------- */}
      <section className="day5-hero">
        <video
          src="/video-season1/day-5.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day5-hero-video"
        />

        <div className="day5-hero-text">
          <p className="day5-hero-tag">SEA WITHIN · DAY 5</p>
          <h1 className="day5-hero-title">The Breath of Life</h1>
          <p className="day5-hero-subtitle">A ritual safe for everyone. A return to your first yes.</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING TEXT */}
      {/* -------------------------------------------------- */}
      <section className="cinematic-opening">
        <span>Before you spoke a word, before you opened your eyes,</span>
        <span>your breath arrived.</span>
        <span className="mt">It was the first yes your body ever gave the world.</span>
        <span>The moment life chose you — and you chose it back.</span>
        <span className="mt">Today, you return to that yes.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. THREE ANCIENT BREATH TECHNIQUES */}
      {/* -------------------------------------------------- */}
      <section className="day5-grid">

        {/* Technique 1 */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day5-birth-breath.mp4" />
            </video>
          </div>

          <p className="grid-title">The Birth-Breath</p>
          <p className="grid-text">The ancient inhale that awakens the first light within you.</p>

          <div className="element-paragraph">
            <p>Take one slow inhale, as if it were your very first.</p>
            <p>Let it rise like dawn inside you.</p>
            <p>Feel it open the quiet doors of your ribs.</p>
            <p>Feel it stretch the sleeping corners of your lungs.</p>
            <p>This is not just air — this is your arrival.</p>
          </div>
        </div>

        {/* Technique 2 */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day5-remembering-breath.mp4" />
            </video>
          </div>

          <p className="grid-title">The Remembering Breath</p>
          <p className="grid-text">The exhale that releases centuries of held tension.</p>

          <div className="element-paragraph">
            <p>Let the exhale fall out of you like a truth you’ve held too long.</p>
            <p>Feel your shoulders drop.</p>
            <p>Feel your jaw soften.</p>
            <p>Feel your heart unclench.</p>
            <p>Your body remembers how to let go — it always has.</p>
          </div>
        </div>

        {/* Technique 3 */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day5-expanding-breath.mp4" />
            </video>
          </div>

          <p className="grid-title">The Expanding Breath</p>
          <p className="grid-text">The breath that turns your body into a vessel of living light.</p>

          <div className="element-paragraph">
            <p>Imagine your breath glowing — a soft, expanding light inside your body.</p>
            <p>With every inhale, your light grows brighter.</p>
            <p>With every exhale, your energy rises higher.</p>
            <p>Your chest becomes a lantern.</p>
            <p>Your spine becomes a pillar.</p>
            <p>This is the breath of life — and it is waking you.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>Your breath is your anchor.</span>
        <span>Your breath is your power.</span>
        <span>Your breath is your life.</span>
        <span>Return tomorrow.</span>
      </footer>

    </div>
  );
}
