"use client";
import "./day13.css";

export default function Day13Page() {
  return (
    <div className="day13-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day13-hero">
        <video
          src="/video-season2/day-13.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day13-hero-video"
        />

        <div className="day13-hero-overlay">
          <p className="day13-hero-tag">SEASON 2 · DAY 13</p>
          <h1 className="day13-hero-title">Gratitude in Motion</h1>
          <p className="day13-hero-subtitle">Warmth · Flow · Appreciation</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Gratitude becomes real when it moves — when it travels through the body instead of staying trapped in the mind.</span>
        <span>Today, you follow a mythic lineage inspired by ancient morning‑gratitude gestures, where small movements expressed appreciation for life.</span>
        <span>Place your hand on your chest and take one slow breath. Then let your hand open outward, as if offering warmth to the world.</span>
        <span className="mt">This is gratitude made physical.</span>
        <span>This ritual teaches your body to recognize goodness — even in small moments.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day13-grid">

        {/* BODY — THE CHEST TOUCH */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day13-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE CHEST TOUCH</p>
          <p className="grid-text">
            Inspired by ancient gratitude gestures where touch awakened emotional warmth.
          </p>

          <div className="element-paragraph">
            <p>Place your hand on your chest.</p>
            <p>Early humans touched their heart area to express appreciation.</p>
            <p>Feel the warmth beneath your palm.</p>
            <p>This is gratitude entering the body.</p>
          </div>
        </div>

        {/* MIND — THE OPENING THOUGHT */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day13-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE OPENING THOUGHT</p>
          <p className="grid-text">
            Echoing ancient morning‑mind practices where gratitude softened mental tension.
          </p>

          <div className="element-paragraph">
            <p>Think of one small thing you’re grateful for today.</p>
            <p>Ancient morning rituals used simple gratitude to brighten the mind.</p>
            <p>Let the thought be gentle, not forced.</p>
            <p>This is your mind opening to goodness.</p>
          </div>
        </div>

        {/* SPIRIT — THE OFFERING GESTURE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}>
              <source src="/video-season2/day13-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE OFFERING GESTURE</p>
          <p className="grid-text">
            Inspired by mythic hearth‑keeper traditions where outward gestures shared inner warmth.
          </p>

          <div className="element-paragraph">
            <p>Extend your hand outward, palm open.</p>
            <p>Mythic hearth‑keepers believed gratitude grew when shared.</p>
            <p>Feel the subtle warmth that rises as you offer your gesture.</p>
            <p>Your spirit expands when gratitude moves outward.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are grateful.</span>
        <span>You are open.</span>
        <span>You are offering warmth.</span>
      </footer>

    </div>
  );
}
