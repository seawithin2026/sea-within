"use client";
import "./day4.css";

export default function Day4Page() {
  return (
    <div className="day4-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day4-hero">
        <video
          src="/video-season1/day4-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day4-hero-video"
        />

        <div className="day4-hero-overlay">
          <p className="day4-hero-tag">SEA WITHIN · DAY 4</p>
          <h1 className="day4-hero-title">The Protection Ritual</h1>
          <p className="day4-hero-subtitle">Seal your inner power in a dome of light.</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT */}
      {/* -------------------------------------------------- */}
      <section className="cinematic-opening">
        <span>Today, you draw a circle around your becoming.</span>
        <span>A boundary of light. A shield of truth.</span>
        <span className="mt">What rises within you is sacred.</span>
        <span>And today, you protect it.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT PROTECTION TECHNIQUES GRID */}
      {/* -------------------------------------------------- */}
      <section className="day4-grid">

        {/* SHIELDING BREATH — BREATH OF THE SENTINEL */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day4-shielding-breath.mp4" />
            </video>
          </div>

          <p className="grid-title">The Shielding Breath</p>
          <p className="grid-text">The ancient breath of the sentinel that builds your first circle of light.</p>

          <div className="element-paragraph">
            <p>Inhale slowly, as if drawing in the first light of dawn.</p>
            <p>Let the breath expand outward, not as air — but as a widening field of presence.</p>
            <p>With each inhale, your inner force gathers.</p>
            <p>With each exhale, your boundary strengthens.</p>
            <p>This is the Breath of the Sentinel — the ancient art of building a shield from within.</p>
            <p>Your breath becomes architecture. Your breath becomes protection.</p>
          </div>
        </div>

        {/* DOME OF LIGHT — LUMINOUS SPHERE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day4-dome-of-light.mp4" />
            </video>
          </div>

          <p className="grid-title">The Dome of Light</p>
          <p className="grid-text">The luminous sphere that rises around you like a sanctuary of radiance.</p>

          <div className="element-paragraph">
            <p>Visualize a sphere rising around you — not imagined, but remembered.</p>
            <p>A dome of light that curves upward from your feet, arches over your crown, and seals behind your spine.</p>
            <p>This is the Luminous Sphere — a ritual once used to guard initiates as they stepped into their becoming.</p>
            <p>Nothing heavy can cross this threshold. Nothing draining can enter.</p>
            <p>This dome is not escape — it is sovereignty.</p>
            <p>A sanctuary woven from your own radiance.</p>
          </div>
        </div>

        {/* SEAL OF PROTECTION — HEARTWARD SEAL */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day4-seal-of-protection.mp4" />
            </video>
          </div>

          <p className="grid-title">The Seal of Protection</p>
          <p className="grid-text">The heartward seal that locks your inner flame behind a veil of light.</p>

          <div className="element-paragraph">
            <p>Place your hand over your heart.</p>
            <p>Feel the warmth beneath your palm — the quiet fire that has carried you through every chapter.</p>
            <p>This is the Heartward Seal — a sacred gesture that locks your inner flame behind a veil of light.</p>
            <p>By your breath, you are guarded. By your dome, you are held.</p>
            <p>By your truth, you are untouchable.</p>
            <p>Your energy answers to no one. Your inner fire is yours alone.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>Your light is sealed.</span>
        <span>Your energy is your own.</span>
        <span>The journey continues.</span>
      </footer>

    </div>
  );
}
