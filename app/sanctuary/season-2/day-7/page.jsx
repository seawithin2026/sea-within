"use client";
import "./day7.css";

export default function Day7Page() {
  return (
    <div className="day7-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day7-hero">
        <video
          src="/video-season2/day-7.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day7-hero-video"
        />

        <div className="day7-hero-overlay">
          <p className="day7-hero-tag">SEASON 2 · DAY 7</p>
          <h1 className="day7-hero-title">The Emotional Release</h1>
          <p className="day7-hero-subtitle">Expression · Movement · Cleansing</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Emotion is meant to move — not stay trapped. Your body knows how to release long before your mind understands why.</span>
        <span>Today, you follow a mythic lineage inspired by early human emotional‑movement practices, where sound and motion kept the spirit clear.</span>
        <span>Choose one release: hum, sigh, cry, laugh, shake your arms, or speak a truth out loud.</span>
        <span className="mt">Let your body express without judgment.</span>
        <span>This ritual frees your inner river — reminding you that expression is cleansing, not weakness.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day7-grid">

        {/* BODY — THE SHAKE RELEASE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day7-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE SHAKE RELEASE</p>
          <p className="grid-text">
            Inspired by early human instinctive shaking used to release tension and reset the nervous system.
          </p>

          <div className="element-paragraph">
            <p>Shake your arms, hands, or shoulders for a few seconds.</p>
            <p>Early humans shook instinctively after stress to clear stored energy.</p>
            <p>Let your movement be loose, messy, natural.</p>
            <p>This is your body returning to balance.</p>
          </div>
        </div>

        {/* MIND — THE SOUND RELEASE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day7-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE SOUND RELEASE</p>
          <p className="grid-text">
            Echoing ancient vocal‑release practices where humming and sighing softened mental pressure.
          </p>

          <div className="element-paragraph">
            <p>Hum or sigh gently — let sound carry what the mind holds tightly.</p>
            <p>Ancient humans used sound to soothe the mind and regulate emotion.</p>
            <p>Feel your thoughts soften as vibration moves through you.</p>
            <p>This is your mind learning to let go.</p>
          </div>
        </div>

        {/* SPIRIT — THE TRUTH RELEASE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day7-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE TRUTH RELEASE</p>
          <p className="grid-text">
            Inspired by early communal practices where speaking truth cleared emotional stagnation.
          </p>

          <div className="element-paragraph">
            <p>Say one honest sentence out loud — anything your spirit has been holding.</p>
            <p>Early humans used spoken truth to release emotional weight.</p>
            <p>Feel the clarity that follows expression.</p>
            <p>Your spirit opens when your voice is allowed.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are expressed.</span>
        <span>You are cleared.</span>
        <span>You are free.</span>
      </footer>

    </div>
  );
}
