"use client";
import "./day14.css";

export default function Day14Page() {
  return (
    <div className="day14-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day14-hero">
        <video
          src="/video-season2/day-14.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day14-hero-video"
        />

        <div className="day14-hero-overlay">
          <p className="day14-hero-tag">SEASON 2 · DAY 14</p>
          <h1 className="day14-hero-title">The Future Whisper</h1>
          <p className="day14-hero-subtitle">Guidance · Intuition · Soft Knowing</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Your future self is not far away — just a few choices ahead, already watching over you with quiet clarity.</span>
        <span>Today, you follow a mythic lineage inspired by ancient future‑projection practices, where people listened for inner guidance in moments of stillness.</span>
        <span>Close your eyes for five seconds and imagine your future self leaning in to whisper one sentence.</span>
        <span className="mt">Whatever comes to mind first is the message.</span>
        <span>This ritual teaches you to trust the soft voice inside — the one that already knows the way.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day14-grid">

        {/* BODY — THE STILL BODY */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day14-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE STILL BODY</p>
          <p className="grid-text">
            Inspired by ancient stillness practices where the body became a vessel for intuition.
          </p>

          <div className="element-paragraph">
            <p>Pause your body completely for five seconds.</p>
            <p>Early humans used stillness to access inner guidance.</p>
            <p>Feel your breath settle and your chest soften.</p>
            <p>This is your body opening to intuition.</p>
          </div>
        </div>

        {/* MIND — THE FIRST THOUGHT */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day14-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE FIRST THOUGHT</p>
          <p className="grid-text">
            Echoing ancient inner‑mind practices where the first thought was considered the truest.
          </p>

          <div className="element-paragraph">
            <p>Listen for the first sentence your mind offers.</p>
            <p>Ancient guidance rituals trusted the initial whisper.</p>
            <p>Let the message arrive without forcing it.</p>
            <p>This is your mind revealing direction.</p>
          </div>
        </div>

        {/* SPIRIT — THE FUTURE SELF */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day14-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE FUTURE SELF</p>
          <p className="grid-text">
            Inspired by mythic vision‑keeper traditions where the future self was seen as a guiding presence.
          </p>

          <div className="element-paragraph">
            <p>Imagine your future self leaning close.</p>
            <p>Mythic vision‑keepers believed the future self carried clarity.</p>
            <p>Feel the warmth of their presence.</p>
            <p>Your spirit listens when the future whispers.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are guided.</span>
        <span>You are listening.</span>
        <span>Your future is whispering.</span>
      </footer>

    </div>
  );
}
