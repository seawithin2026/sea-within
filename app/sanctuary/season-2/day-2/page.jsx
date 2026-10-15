"use client";
import "./day2.css";

export default function Day2Page() {
  return (
    <div className="day2-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day2-hero">
        <video
          src="/video-season2/day-2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day2-hero-video"
        />

        <div className="day2-hero-overlay">
          <p className="day2-hero-tag">SEASON 2 · DAY 2</p>
          <h1 className="day2-hero-title">The Stillness Minute Ritual</h1>
          <p className="day2-hero-subtitle">Silence · Clarity · Presence</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Stillness has been a sacred practice across countless ancient traditions — a quiet doorway into clarity.</span>
        <span>Today, you follow a mythic lineage inspired by these truths: the belief that silence restores what noise steals.</span>
        <span>In this pause, your breath slows, your thoughts settle, and your inner world opens like dawn over old mountains.</span>
        <span className="mt">The elders taught that peace is not created — it is revealed when the world grows quiet.</span>
        <span>Let this minute return you to yourself.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day2-grid">

        {/* BODY — STILLNESS PAUSE */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day2-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE BODY STILLNESS PAUSE</p>
          <p className="grid-text">
            Inspired by ancient practices of physical stillness found in early monastic traditions.
          </p>

          <div className="element-paragraph">
            <p>Stand or sit completely still for one minute, letting your body settle into its natural rhythm.</p>
            <p>Ancient monks believed the body reveals truth only when movement ceases.</p>
            <p>Feel your weight, your breath, your presence — simple, honest, real.</p>
            <p>Let this pause reconnect you to your physical self, steady and grounded.</p>
          </div>
        </div>

        {/* MIND — LISTENING MIND */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.5)}>
              <source src="/video-season2/day2-mind.mp4" />
            </video>
          </div>
          <p className="grid-title fire">THE LISTENING MIND</p>
          <p className="grid-text">
            Echoing the ancient Greek practice of hesychia — sacred inner quiet.
          </p>

          <div className="element-paragraph">
            <p>Close your eyes and listen for the space beneath sound.</p>
            <p>Greek philosophers taught that clarity arrives when the mind stops speaking.</p>
            <p>Notice how silence has texture, warmth, and depth.</p>
            <p>Let this moment soften your thoughts and open your inner horizon.</p>
          </div>
        </div>

        {/* SPIRIT — INNER PEACE HOLD */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day2-spirit.mp4" />
            </video>
          </div>
          <p className="grid-title earth">THE INNER PEACE HOLD</p>
          <p className="grid-text">
            Inspired by ancient Taoist xin jing — the art of quieting the heart.
          </p>

          <div className="element-paragraph">
            <p>Place your hand over your heart and breathe slowly.</p>
            <p>Taoist sages believed the heart reveals truth only when the breath grows gentle.</p>
            <p>Feel the rhythm beneath your palm — ancient, steady, loyal.</p>
            <p>Let this hold remind you that peace is already inside you, waiting to be felt.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are calm.</span>
        <span>You are centered.</span>
        <span>Stillness reveals truth.</span>
      </footer>

    </div>
  );
}
