"use client";
import "./day5.css";

export default function Day5Page() {
  return (
    <div className="day5-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day5-hero">
        <video
          src="/video-season2/day-5.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day5-hero-video"
        />

        <div className="day5-hero-overlay">
          <p className="day5-hero-tag">SEASON 2 · DAY 5</p>
          <h1 className="day5-hero-title">The Gratitude Whisper</h1>
          <p className="day5-hero-subtitle">Softness · Warmth · Abundance</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Gratitude is quiet alchemy — a softening of the heart that has echoed through ancient traditions for centuries.</span>
        <span>Today, you follow a mythic lineage inspired by early Sufi heart‑softening practices, where gratitude was whispered into the hands to awaken warmth within.</span>
        <span>Hold your hands together, whisper one truth of gratitude, and feel your own touch become medicine.</span>
        <span className="mt">Gratitude is not a thought — it is a frequency.</span>
        <span>Let this ritual shift your entire day toward abundance.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day5-grid">

        {/* BODY — THE HEART TOUCH */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day5-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE HEART TOUCH</p>
          <p className="grid-text">
            Inspired by ancient Sufi practices of placing warmth into the hands before touching the heart.
          </p>

          <div className="element-paragraph">
            <p>Whisper one gratitude into your hands, then place them gently on your heart.</p>
            <p>Sufi mystics believed warmth carried intention deeper into the body.</p>
            <p>Feel your touch soften your chest and steady your breath.</p>
            <p>This is gratitude becoming physical — becoming real.</p>
          </div>
        </div>

        {/* MIND — THE SOFTENING THOUGHT */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day5-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE SOFTENING THOUGHT</p>
          <p className="grid-text">
            Echoing ancient desert‑wisdom teachings that gratitude clears mental dust.
          </p>

          <div className="element-paragraph">
            <p>Let your whispered gratitude echo in your mind.</p>
            <p>Ancient wanderers believed gratitude cleared the inner horizon like wind sweeping sand.</p>
            <p>Notice how your thoughts soften, widen, and brighten.</p>
            <p>This ritual teaches the mind to see abundance where it once saw pressure.</p>
          </div>
        </div>

        {/* SPIRIT — THE ABUNDANCE WITHIN */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}>
              <source src="/video-season2/day5-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE ABUNDANCE WITHIN</p>
          <p className="grid-text">
            Inspired by mythic desert‑heart traditions where gratitude opened the spirit to warmth.
          </p>

          <div className="element-paragraph">
            <p>Feel the warmth in your chest expand outward.</p>
            <p>Ancient mystics believed gratitude was a doorway to spiritual abundance.</p>
            <p>Let this warmth fill your inner space like sunrise over quiet dunes.</p>
            <p>Your spirit opens when you acknowledge what already exists.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are softened.</span>
        <span>You are warmed.</span>
        <span>You are abundant.</span>
      </footer>

    </div>
  );
}
