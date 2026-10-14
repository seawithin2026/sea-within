"use client";
import "./day15.css";

export default function Day15Page() {
  return (
    <div className="day15-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day15-hero">
        <video
          src="/video-season2/day-15.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day15-hero-video"
        />

        <div className="day15-hero-overlay">
          <p className="day15-hero-tag">SEASON 2 · DAY 15</p>
          <h1 className="day15-hero-title">The Soft Promise</h1>
          <p className="day15-hero-subtitle">Intention · Warmth · Assurance</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Your heart steadies when you speak gently to it — when you offer a promise that feels soft, human, and possible.</span>
        <span>Today, you follow a mythic lineage inspired by ancient self‑assurance practices, where people whispered small intentions to guide their day.</span>
        <span>Choose one soft promise for yourself: something kind, something doable, something warm.</span>
        <span className="mt">Say it quietly in your mind.</span>
        <span>This ritual teaches you that gentle intention is a form of self‑care.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day15-grid">

        {/* BODY — THE QUIET BREATH */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day15-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE QUIET BREATH</p>
          <p className="grid-text">
            Inspired by ancient calming practices where breath prepared the body for intention.
          </p>

          <div className="element-paragraph">
            <p>Take one slow breath before choosing your promise.</p>
            <p>Early humans used breath to steady emotion.</p>
            <p>Feel your chest soften as you inhale.</p>
            <p>This is your body preparing to receive kindness.</p>
          </div>
        </div>

        {/* MIND — THE GENTLE INTENTION */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day15-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE GENTLE INTENTION</p>
          <p className="grid-text">
            Echoing ancient inner‑mind practices where soft promises shaped emotional direction.
          </p>

          <div className="element-paragraph">
            <p>Choose one promise that feels warm and possible.</p>
            <p>Ancient intention rituals used gentle phrasing to guide the mind.</p>
            <p>Let the promise be small, not grand.</p>
            <p>This is your mind aligning with kindness.</p>
          </div>
        </div>

        {/* SPIRIT — THE INNER ASSURANCE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day15-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE INNER ASSURANCE</p>
          <p className="grid-text">
            Inspired by mythic hearth‑keeper traditions where quiet promises strengthened the spirit.
          </p>

          <div className="element-paragraph">
            <p>Feel the warmth that rises when you speak your promise internally.</p>
            <p>Mythic hearth‑keepers believed assurance created inner stability.</p>
            <p>Let the promise settle into your chest.</p>
            <p>Your spirit steadies when intention is gentle.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are steady.</span>
        <span>You are intentional.</span>
        <span>Your promise is soft and real.</span>
      </footer>

    </div>
  );
}
