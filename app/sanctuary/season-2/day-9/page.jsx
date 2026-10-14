"use client";
import "./day9.css";

export default function Day9Page() {
  return (
    <div className="day9-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day9-hero">
        <video
          src="/video-season2/day-9.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day9-hero-video"
        />

        <div className="day9-hero-overlay">
          <p className="day9-hero-tag">SEASON 2 · DAY 9</p>
          <h1 className="day9-hero-title">Breath of Expansion</h1>
          <p className="day9-hero-subtitle">Calm · Balance · Space</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>A long exhale is a long life. Breath shapes the nervous system, the heart, and the inner horizon.</span>
        <span>Today, you follow a mythic lineage inspired by ancient healer breath‑ratio practices, where extended exhales restored balance and longevity.</span>
        <span>Inhale for four, exhale for six — repeat five times.</span>
        <span className="mt">Let your breath lengthen your inner space.</span>
        <span>This ritual teaches you that peace is a physical practice.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day9-grid">

        {/* BODY — THE LENGTHENED EXHALE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day9-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE LENGTHENED EXHALE</p>
          <p className="grid-text">
            Inspired by ancient healer breathwork where longer exhales calmed the body.
          </p>

          <div className="element-paragraph">
            <p>Inhale for four seconds, exhale for six.</p>
            <p>Early healers taught that extended exhales signaled safety to the body.</p>
            <p>Feel your muscles soften as your breath slows.</p>
            <p>This is your body entering balance.</p>
          </div>
        </div>

        {/* MIND — THE INNER SPACE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day9-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE INNER SPACE</p>
          <p className="grid-text">
            Echoing ancient breath‑mind teachings where slow breathing widened mental clarity.
          </p>

          <div className="element-paragraph">
            <p>Notice how your mind feels after each long exhale.</p>
            <p>Ancient caretakers believed breath created space inside the mind.</p>
            <p>Thoughts loosen, soften, and drift.</p>
            <p>This is your mind expanding gently.</p>
          </div>
        </div>

        {/* SPIRIT — THE CALM WITHIN */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day9-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE CALM WITHIN</p>
          <p className="grid-text">
            Inspired by mythic breath‑keepers who used slow exhale rituals to steady the spirit.
          </p>

          <div className="element-paragraph">
            <p>Feel the quiet that rises as your breath lengthens.</p>
            <p>Mythic breath‑keepers believed calm was carried on the exhale.</p>
            <p>Let the stillness settle into your chest.</p>
            <p>Your spirit expands when your breath slows.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are calm.</span>
        <span>You are balanced.</span>
        <span>You are expanded.</span>
      </footer>

    </div>
  );
}
