"use client";
import { useState } from "react";
import "./day2.css";

export default function Day2Page() {
  const [fire, setFire] = useState(false);
  const [water, setWater] = useState(false);
  const [earth, setEarth] = useState(false);

  const allActive = fire && water && earth;

  const activate = (setter) => {
    setter(true);
  };

  const unify = () => {
    setFire(true);
    setWater(true);
    setEarth(true);
  };

  return (
    <div className={`day2-page ${fire ? "fire-active" : ""} ${water ? "water-active" : ""} ${earth ? "earth-active" : ""} ${allActive ? "unified" : ""}`}>

      {/* HERO VIDEO */}
      <section className="relative w-full h-[130vh] overflow-hidden day2-hero">
        <video
          src="/video-season1/day-2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* DARK GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/80 z-10"></div>

        {/* HERO TEXT */}
        <div 
          className="absolute inset-0 flex flex-col justify-end px-10 z-20"
          style={{ paddingBottom: "48rem" }}
        >
          <p 
            className="uppercase text-slate-200"
            style={{
              fontSize: "0.85rem",
              letterSpacing: "0.38em",
              marginBottom: "1.2rem",
              opacity: 0.92,
            }}
          >
            Sea Within · Day 2
          </p>

          <h1
            className="font-light text-slate-100"
            style={{
              fontSize: "2.9rem",
              lineHeight: "1.45",
              maxWidth: "38rem",
              textShadow: "0 0 22px rgba(0,0,0,0.65)",
            }}
          >
            The Triple Flame Ritual
          </h1>

          <p
            className="text-slate-300"
            style={{
              marginTop: "1.8rem",
              fontSize: "1.25rem",
              letterSpacing: "0.08em",
              opacity: 0.95,
            }}
          >
            Awaken the Fire, the Sea, the Earth within you.
          </p>
        </div>
      </section>

      {/* Ambient Glows */}
      <div className="glow fire"></div>
      <div className="glow water"></div>
      <div className="glow earth"></div>

      <header className="header">
        <div className="tag">
          <span className="tag-dot"></span>
          <span>Sea Within · Day 2</span>
        </div>
        <h1 className="title">The Triple Flame Ritual</h1>
        <p className="subtitle">Awaken the Fire, the Sea, the Earth within you.</p>
      </header>

      <section className="opening">
        <span>Today, the Triple Flame rises within you.</span>
        <span>The Fire that transforms.</span>
        <span>The Sea that remembers.</span>
        <span>The Earth that holds you steady.</span>
        <span className="mt">Three powers. One self.</span>
        <span>This is the moment you begin to become.</span>
      </section>

      <section className="sections">

        {/* FIRE */}
        <article className={`section ${fire ? "pulse" : ""}`}>
          <div className="section-label">Aspect I</div>
          <div className="section-title fire">The Fire Within</div>
          <p className="section-instruction">
            Bring your hand to your heart. Feel the warmth beneath your skin.
          </p>
          <p className="section-text">
            <span>Here is your Fire.</span>
            <span>The spark that never died, even when you dimmed yourself.</span>
            <span>The part of you that knows exactly who you are becoming.</span>
            <span>Let it rise. Let it speak. Let it burn clean.</span>
          </p>
          <button className="btn btn-fire" onClick={() => activate(setFire)}>
            <span className="dot"></span>
            Ignite
          </button>
        </article>

        {/* SEA (formerly WATER / WELL) */}
        <article className={`section ${water ? "pulse" : ""}`}>
          <div className="section-label">Aspect II</div>
          <div className="section-title water">The Sea Within</div>
          <p className="section-instruction">
            Touch your stomach. Breathe into the softness.
          </p>
          <p className="section-text">
            <span>Here is your Sea.</span>
            <span>The quiet depth beneath your emotions.</span>
            <span>The movement inside you that never lies.</span>
            <span>The water that holds your memory without judgment.</span>
            <span>Let it steady you. Let it clear you. Let it bring you back to your center.</span>
          </p>
          <button className="btn btn-water" onClick={() => activate(setWater)}>
            <span className="dot"></span>
            Let It Flow
          </button>
        </article>

        {/* EARTH */}
        <article className={`section ${earth ? "pulse" : ""}`}>
          <div className="section-label">Aspect III</div>
          <div className="section-title earth">The Earth Within</div>
          <p className="section-instruction">
            Place your feet firmly on the ground.
          </p>
          <p className="section-text">
            <span>Here is your Earth.</span>
            <span>The strength beneath your tenderness.</span>
            <span>The ground that has carried you through every ending.</span>
            <span>Let it root you. Let it steady you. Let it hold your becoming.</span>
          </p>
          <button className="btn btn-earth" onClick={() => activate(setEarth)}>
            <span className="dot"></span>
            Root Me
          </button>
        </article>

      </section>

      <section className="unification">
        <span>Fire to awaken you.</span>
        <span>Sea to clear you.</span>
        <span>Earth to protect you.</span>
        <span className="mt">Three powers rising.</span>
        <span>One self returning.</span>
        <span className="mt">Today, you awaken the Triple Flame.</span>
        <span>Today, you awaken the Sea Within.</span>

        <div className="unification-symbol"></div>

        <button className="btn btn-main" onClick={unify}>
          Awaken the Triple Flame
        </button>
      </section>

      <footer className="closing">
        <span>You are becoming.</span>
        <span>Return tomorrow.</span>
        <span>The journey continues.</span>
      </footer>
    </div>
  );
}
