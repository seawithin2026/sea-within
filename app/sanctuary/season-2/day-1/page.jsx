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
          src="/video-season2/day-1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day1-hero-video"
        />

        <div className="day1-hero-overlay">
          <p className="day1-hero-tag">SEASON 2 · DAY 1</p>
          <h1 className="day1-hero-title">The Breath of Arrival</h1>
          <p className="day1-hero-subtitle">Spirit · Health · Wealth</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — FULLNESS ENERGY */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Breath is the oldest medicine, the first gift every human receives.</span>
        <span>Today, you return to that ancient beginning — the moment where life enters and heaviness leaves.</span>
        <span>With each inhale, imagine the world opening for you; with each exhale, imagine your past releasing its grip.</span>
        <span className="mt">This ritual awakens presence, clarity, and the quiet truth that you are alive in a new way.</span>
        <span>Fullness begins with the breath that chooses you.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — BREATH, STILLNESS, LIGHT */}
      {/* -------------------------------------------------- */}
      <section className="day1-grid">

        {/* BODY — BREATH OF ARRIVAL */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}>
              <source src="/video-season2/day1-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE BREATH OF ARRIVAL</p>
          <p className="grid-text">A grounding breath used by early dawn‑keepers to welcome the new day.</p>

          <div className="element-paragraph">
            <p>Step outside and take ten slow breaths, feeling the air touch your skin like a blessing.</p>
            <p>Inhale as if receiving life; exhale as if releasing yesterday.</p>
            <p>The dawn‑keepers believed breath was a doorway — the moment where the spirit awakens.</p>
            <p>Let this breath remind you that you are here, present, and ready for fullness.</p>
          </div>
        </div>

        {/* MIND — STILLNESS LISTENING */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day1-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE STILLNESS LISTENING</p>
          <p className="grid-text">A mind‑quieting ritual practiced by the ancient listeners of the inner world.</p>

          <div className="element-paragraph">
            <p>Sit for one minute in silence, letting the world soften around you.</p>
            <p>Stillness repairs the body and clears the mind, opening space for new clarity.</p>
            <p>The ancient listeners believed silence was a healer, not an absence.</p>
            <p>Let this moment teach you that peace is not found — it is allowed.</p>
          </div>
        </div>

        {/* SPIRIT — LIGHT OF ARRIVAL */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day1-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE LIGHT OF ARRIVAL</p>
          <p className="grid-text">A spirit‑awakening ritual from the early sun‑walkers of the Eastern Valleys.</p>

          <div className="element-paragraph">
            <p>Let sunlight touch your face for thirty seconds, feeling its warmth enter your bones.</p>
            <p>The sun‑walkers believed light awakened joy and restored inner vitality.</p>
            <p>Imagine the light clearing old shadows and illuminating your next chapter.</p>
            <p>Let this moment remind you that happiness begins with letting light reach you.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — FULLNESS ENERGY */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are awake.</span>
        <span>You are expanding.</span>
        <span>Fullness begins.</span>
      </footer>

    </div>
  );
}
