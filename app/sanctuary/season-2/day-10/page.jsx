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
          src="/video-season2/day-10.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day10-hero-video"
        />

        <div className="day10-hero-overlay">
          <p className="day10-hero-tag">SEASON 2 · DAY 10</p>
          <h1 className="day10-hero-title">The Stillness Walk</h1>
          <p className="day10-hero-subtitle">Presence · Senses · Softness</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Walk slowly for two minutes without your phone. Let the world guide your pace instead of your thoughts.</span>
        <span>Today, you follow a mythic lineage inspired by ancient slow‑walking traditions, where wanderers used gentle movement to awaken the senses.</span>
        <span>Listen to the leaves, feel the air, notice the rhythm of your steps.</span>
        <span className="mt">The world moves softer than modern life.</span>
        <span>This ritual reconnects you to beauty — the kind you only see when you slow down.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day10-grid">

        {/* BODY — THE SLOW STEP */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day10-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE SLOW STEP</p>
          <p className="grid-text">
            Inspired by ancient wanderer practices where slow walking grounded the body.
          </p>

          <div className="element-paragraph">
            <p>Walk slowly — slower than usual.</p>
            <p>Early travelers used slow steps to steady the body and calm the breath.</p>
            <p>Feel each foot meet the earth.</p>
            <p>This is your body returning to the world’s natural pace.</p>
          </div>
        </div>

        {/* MIND — THE SENSE LISTENING */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.5)}>
              <source src="/video-season2/day10-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE SENSE LISTENING</p>
          <p className="grid-text">
            Echoing ancient sensory‑awareness traditions where attention softened the mind.
          </p>

          <div className="element-paragraph">
            <p>Let your senses guide you — sound, air, texture, rhythm.</p>
            <p>Ancient wanderers believed listening cleared mental noise.</p>
            <p>Notice small details you normally miss.</p>
            <p>This is your mind learning to soften.</p>
          </div>
        </div>

        {/* SPIRIT — THE QUIET BEAUTY */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day10-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE QUIET BEAUTY</p>
          <p className="grid-text">
            Inspired by mythic path‑keeper traditions where slow movement awakened spiritual clarity.
          </p>

          <div className="element-paragraph">
            <p>Feel the quiet beauty that rises when you slow down.</p>
            <p>Mythic path‑keepers believed stillness in motion opened the spirit.</p>
            <p>Let the world meet you gently.</p>
            <p>Your spirit expands when you walk softly.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are slower.</span>
        <span>You are softer.</span>
        <span>You are seeing beauty again.</span>
      </footer>

    </div>
  );
}
