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
          src="/video-season2/day-8.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day8-hero-video"
        />

        <div className="day8-hero-overlay">
          <p className="day8-hero-tag">SEASON 2 · DAY 8</p>
          <h1 className="day8-hero-title">A Moment Shared</h1>
          <p className="day8-hero-subtitle">Connection · Warmth · Belonging</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Connection is nourishment — a quiet reminder that you are part of something larger than yourself.</span>
        <span>Today, you follow a mythic lineage inspired by ancient hospitality traditions, where a single line of kindness strengthened the heart.</span>
        <span>Send one message of warmth to someone: a simple sentence, a gentle note, a moment shared.</span>
        <span className="mt">Humans have always been wired for belonging.</span>
        <span>This ritual expands your world — and theirs.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day8-grid">

        {/* BODY — THE KINDNESS ACTION */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day8-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE KINDNESS ACTION</p>
          <p className="grid-text">
            Inspired by ancient messenger traditions where small gestures carried great emotional weight.
          </p>

          <div className="element-paragraph">
            <p>Send one message of kindness — a single line of warmth.</p>
            <p>Ancient travelers exchanged short blessings to strengthen bonds.</p>
            <p>Let your message be simple, honest, and soft.</p>
            <p>This is connection made physical.</p>
          </div>
        </div>

        {/* MIND — THE BELONGING THOUGHT */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day8-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE BELONGING THOUGHT</p>
          <p className="grid-text">
            Echoing early village‑mind teachings that kindness widens mental perspective.
          </p>

          <div className="element-paragraph">
            <p>Notice how your mind feels after sending kindness.</p>
            <p>Ancient communities believed generosity cleared mental heaviness.</p>
            <p>Feel your thoughts brighten and soften.</p>
            <p>This is your mind remembering connection.</p>
          </div>
        </div>

        {/* SPIRIT — THE HEART BRIDGE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day8-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE HEART BRIDGE</p>
          <p className="grid-text">
            Inspired by mythic hearth‑traditions where shared warmth strengthened the spirit.
          </p>

          <div className="element-paragraph">
            <p>Feel the subtle warmth that rises when you reach out.</p>
            <p>Ancient hearth‑keepers believed kindness built invisible bridges between spirits.</p>
            <p>Let that warmth expand inside your chest.</p>
            <p>This is belonging — quiet, gentle, real.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are connected.</span>
        <span>You are warm.</span>
        <span>You belong.</span>
      </footer>

    </div>
  );
}
