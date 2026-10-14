"use client";
import "./day6.css";

export default function Day6Page() {
  return (
    <div className="day6-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day6-hero">
        <video
          src="/video-season2/day-6.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day6-hero-video"
        />

        <div className="day6-hero-overlay">
          <p className="day6-hero-tag">SEASON 2 · DAY 6</p>
          <h1 className="day6-hero-title">A Small Brave Thing</h1>
          <p className="day6-hero-subtitle">Courage · Expansion · Forward</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Purpose grows through small acts of courage — gentle steps that tell your nervous system you are safe to expand.</span>
        <span>Today, you follow a mythic lineage inspired by early mountain‑clan traditions, where young seekers practiced micro‑bravery to strengthen the spirit.</span>
        <span>Choose one tiny thing you’ve been avoiding: a message, a task, a truth, a step.</span>
        <span className="mt">Do it softly, without pressure.</span>
        <span>This ritual awakens your inner leader — the part of you that moves life forward.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day6-grid">

        {/* BODY — THE GENTLE ACTION */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day6-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE GENTLE ACTION</p>
          <p className="grid-text">
            Inspired by ancient mountain‑clan practices of taking one small physical step each day.
          </p>

          <div className="element-paragraph">
            <p>Choose one tiny action you’ve been avoiding — something simple and doable.</p>
            <p>Ancient seekers believed small physical steps trained the body to trust change.</p>
            <p>Do it slowly, gently, without force.</p>
            <p>This is courage made physical.</p>
          </div>
        </div>

        {/* MIND — THE FEAR SOFTENING */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day6-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE FEAR SOFTENING</p>
          <p className="grid-text">
            Echoing ancient desert‑mind teachings that fear shrinks when named gently.
          </p>

          <div className="element-paragraph">
            <p>Notice the fear or resistance around your small brave thing.</p>
            <p>Early wanderers taught that naming fear softened its edges.</p>
            <p>Say quietly: “This is small. I can do this.”</p>
            <p>Your mind learns safety through softness, not force.</p>
          </div>
        </div>

        {/* SPIRIT — THE EXPANSION WITHIN */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day6-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE EXPANSION WITHIN</p>
          <p className="grid-text">
            Inspired by mythic clan‑elder teachings that courage expands the inner horizon.
          </p>

          <div className="element-paragraph">
            <p>After your small brave thing, pause and breathe.</p>
            <p>Ancient elders believed courage opened the spirit like dawn over mountains.</p>
            <p>Feel the subtle expansion inside your chest.</p>
            <p>This is your inner leader awakening.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are brave.</span>
        <span>You are expanding.</span>
        <span>You are moving forward.</span>
      </footer>

    </div>
  );
}
