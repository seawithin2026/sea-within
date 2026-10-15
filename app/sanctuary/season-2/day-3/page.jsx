"use client";
import "./day3.css";

export default function Day3Page() {
  return (
    <div className="day3-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day3-hero">
        <video
          src="/video-season2/day-3.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day3-hero-video"
        />

        <div className="day3-hero-overlay">
          <p className="day3-hero-tag">SEASON 2 · DAY 3</p>
          <h1 className="day3-hero-title">The Sun on Skin Ritual</h1>
          <p className="day3-hero-subtitle">Warmth · Renewal · Awakening</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>For thousands of years, people greeted the sun as a living blessing — a quiet healer rising over the world.</span>
        <span>Today, you follow a mythic lineage inspired by these truths: the belief that sunlight awakens the spirit and restores the body.</span>
        <span>Warmth softens tension, light clears the inner horizon, and presence returns like morning over ancient stone.</span>
        <span className="mt">The elders taught that sunlight is not just seen — it is received.</span>
        <span>Let this ritual open you to renewal.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day3-grid">

        {/* BODY — SUN TOUCH */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.3)}>
              <source src="/video-season2/day3-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE SUN TOUCH</p>
          <p className="grid-text">
            Inspired by ancient Egyptian sunrise practices honoring warmth as a source of vitality.
          </p>

          <div className="element-paragraph">
            <p>Step into natural light and let the sun touch your skin for thirty seconds.</p>
            <p>Egyptian healers believed morning light awakened the body’s inner strength.</p>
            <p>Feel the warmth enter your muscles, softening what has grown tight.</p>
            <p>Let this moment remind you that renewal begins with receiving light.</p>
          </div>
        </div>

        {/* MIND — LIGHT LISTENING */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day3-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE LIGHT LISTENING</p>
          <p className="grid-text">
            Echoing ancient Greek heliosis — the practice of mindful sun‑gazing at dawn.
          </p>

          <div className="element-paragraph">
            <p>Close your eyes and face the light, letting its brightness glow behind your eyelids.</p>
            <p>Greek philosophers taught that light clears the mind and reveals inner clarity.</p>
            <p>Notice how the glow feels like a gentle awakening inside your thoughts.</p>
            <p>Let this moment open space for new ideas and quiet understanding.</p>
          </div>
        </div>

        {/* SPIRIT — THE WARMTH WITHIN */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day3-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE WARMTH WITHIN</p>
          <p className="grid-text">
            Inspired by ancient Vedic traditions that viewed sunlight as a purifier of the inner self.
          </p>

          <div className="element-paragraph">
            <p>Place your hand over your heart and imagine the sunlight entering your chest.</p>
            <p>Vedic sages believed warmth dissolved heaviness and restored inner harmony.</p>
            <p>Feel the gentle heat spreading through your spirit like a soft golden tide.</p>
            <p>Let this warmth remind you that awakening begins from within.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are warmed.</span>
        <span>You are renewed.</span>
        <span>Light awakens you.</span>
      </footer>

    </div>
  );
}
