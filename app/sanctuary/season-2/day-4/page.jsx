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
          src="/video-season2/day-4.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day4-hero-video"
        />

        <div className="day4-hero-overlay">
          <p className="day4-hero-tag">SEASON 2 · DAY 4</p>
          <h1 className="day4-hero-title">The Body Remembers</h1>
          <p className="day4-hero-subtitle">Movement · Memory · Release</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Your body carries stories older than your thoughts — a living archive shaped by breath, emotion, and experience.</span>
        <span>Ancient traditions believed movement released what the mind could not name, restoring balance through motion.</span>
        <span>Today, you follow this mythic lineage: letting your body lead instead of your mind.</span>
        <span className="mt">Stretch, sway, dance, or move in a way unfamiliar to you.</span>
        <span>Let movement become memory, and memory become release.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day4-grid">

        {/* BODY — THE UNFAMILIAR MOVE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}>
              <source src="/video-season2/day4-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE UNFAMILIAR MOVE</p>
          <p className="grid-text">
            Inspired by ancient somatic practices where unfamiliar movement released stored tension.
          </p>

          <div className="element-paragraph">
            <p>Move in a way you normally don’t — stretch, sway, circle, or bend.</p>
            <p>Ancient healers taught that unfamiliar motion awakens forgotten parts of the body.</p>
            <p>Let your body guide you without thought or judgment.</p>
            <p>This is how the body remembers and how the body releases.</p>
          </div>
        </div>

        {/* MIND — THE MEMORY SHIFT */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day4-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE MEMORY SHIFT</p>
          <p className="grid-text">
            Echoing ancient Greek and early monastic teachings that movement reshapes mental patterns.
          </p>

          <div className="element-paragraph">
            <p>As you move, notice what thoughts arise — not to analyze them, but to witness them.</p>
            <p>Movement shifts the mind, loosening old narratives.</p>
            <p>Let your thoughts drift like dust shaken from old stone.</p>
            <p>This ritual teaches the mind to follow the body, not control it.</p>
          </div>
        </div>

        {/* SPIRIT — THE RELEASE WITHIN */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}>
              <source src="/video-season2/day4-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE RELEASE WITHIN</p>
          <p className="grid-text">
            Inspired by ancient Vedic and Taoist views of movement as spiritual cleansing.
          </p>

          <div className="element-paragraph">
            <p>Let your movement become expression — a sigh, a shake, a gentle flow.</p>
            <p>Ancient traditions believed emotional energy moved through the body, not the mind.</p>
            <p>Feel the release as your spirit softens and opens.</p>
            <p>Your body remembers how to heal — you are simply allowing it.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are moving.</span>
        <span>You are remembering.</span>
        <span>You are releasing.</span>
      </footer>

    </div>
  );
}
