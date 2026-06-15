"use client";
import "./day1.css";

export default function Day1Page() {
  return (
    <div className="day1-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day1-hero">
        <video
          src="/video-season1/day-1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day1-hero-video"
        />

        <div className="day1-hero-overlay">
          <p className="day1-hero-tag">SEA WITHIN · DAY 1</p>
          <h1 className="day1-hero-title">The Cleansing Ritual</h1>
          <p className="day1-hero-subtitle">Mind · Body · Spirit</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — NEW BEGINNING ENERGY */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Every journey begins in the quiet before the first step.</span>
        <span>The moment where the world softens and you finally hear yourself again.</span>
        <span>The ancients believed that before any path could open, the self had to be cleared.</span>
        <span className="mt">Not purified — simply returned to its natural clarity.</span>
        <span>Today, you begin by making space for what is meant to come.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT CLEANSING TECHNIQUES GRID */}
      {/* -------------------------------------------------- */}
      <section className="day1-grid">

        {/* BODY — SILT-WASHING RITE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day1-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE SILT‑WASHING RITE</p>
          <p className="grid-text">A body cleansing once practiced by the river‑keepers of the First Valleys.</p>

          <div className="element-paragraph">
            <p>Bring your hands to your shoulders and sweep downward slowly.</p>
            <p>Imagine ancient river silt — soft, cool, memory‑holding — brushing away the weight you’ve carried.</p>
            <p>The river‑keepers believed silt absorbed heaviness the way earth absorbs rain.</p>
            <p>Let the sweep unburden you. Let the old weight fall away like dust returning home.</p>
          </div>
        </div>

        {/* MIND — SKY-LISTENING BREATH */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day1-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE SKY‑LISTENING BREATH</p>
          <p className="grid-text">A mind‑clearing ritual used by the early sky‑watchers of the high plains.</p>

          <div className="element-paragraph">
            <p>Lift your chin slightly. Inhale upward, as if receiving something from above.</p>
            <p>Exhale downward, letting your thoughts settle like dust returning to still ground.</p>
            <p>The sky‑watchers believed clarity came not from thinking — but from listening.</p>
            <p>Let the breath open your mind. Let the sky quiet your inner noise.</p>
          </div>
        </div>

        {/* SPIRIT — LUMEN THREAD RELEASE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day1-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE LUMEN THREAD RELEASE</p>
          <p className="grid-text">A spirit‑cleansing ritual from the hearth‑weavers of the Northern Valleys.</p>

          <div className="element-paragraph">
            <p>Place your hand over your chest or belly.</p>
            <p>Imagine a glowing thread inside you — your lumen thread — warm, bright, alive.</p>
            <p>The hearth‑weavers believed burdens tangled this inner light, dimming the spirit.</p>
            <p>With a gentle motion, “untangle” the thread. Feel your inner light flow freely again.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — SOFT, BEGINNING ENERGY */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are clear.</span>
        <span>You are open.</span>
        <span>The journey begins.</span>
      </footer>

    </div>
  );
}
