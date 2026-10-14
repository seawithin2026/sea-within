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
          src="/video-season2/day-12.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day12-hero-video"
        />

        <div className="day12-hero-overlay">
          <p className="day12-hero-tag">SEASON 2 · DAY 12</p>
          <h1 className="day12-hero-title">Joyful Movement</h1>
          <p className="day12-hero-subtitle">Lightness · Rhythm · Uplift</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Joy lives in motion — small, playful movements that remind the body it is allowed to feel light again.</span>
        <span>Today, you follow a mythic lineage inspired by ancient festival‑dance traditions, where simple swaying awakened communal happiness.</span>
        <span>Sway your body gently for thirty seconds. No choreography. No rules. Just rhythm.</span>
        <span className="mt">Let your movement be soft, silly, or subtle.</span>
        <span>This ritual teaches your nervous system that joy is safe, accessible, and already inside you.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day12-grid">

        {/* BODY — THE SWAY */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day12-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE SWAY</p>
          <p className="grid-text">
            Inspired by ancient communal swaying used to awaken joy in the body.
          </p>

          <div className="element-paragraph">
            <p>Sway gently from side to side.</p>
            <p>Early humans used simple rhythmic movement to lift the body’s mood.</p>
            <p>Let your shoulders loosen and your breath lighten.</p>
            <p>This is joy made physical.</p>
          </div>
        </div>

        {/* MIND — THE LIGHT THOUGHT */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day12-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE LIGHT THOUGHT</p>
          <p className="grid-text">
            Echoing ancient celebration‑mind teachings where movement softened mental heaviness.
          </p>

          <div className="element-paragraph">
            <p>Notice how your thoughts shift as your body moves.</p>
            <p>Ancient festival‑keepers believed rhythm cleared mental weight.</p>
            <p>Feel your mind brighten, even slightly.</p>
            <p>This is your mind remembering joy.</p>
          </div>
        </div>

        {/* SPIRIT — THE UPLIFT WITHIN */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day12-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE UPLIFT WITHIN</p>
          <p className="grid-text">
            Inspired by mythic joy‑keeper traditions where movement awakened spiritual brightness.
          </p>

          <div className="element-paragraph">
            <p>Feel the subtle uplift rising inside your chest.</p>
            <p>Mythic joy‑keepers believed gentle motion stirred inner light.</p>
            <p>Let that brightness expand softly.</p>
            <p>Your spirit lifts when your body plays.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are lighter.</span>
        <span>You are brighter.</span>
        <span>You are moving with joy.</span>
      </footer>

    </div>
  );
}
