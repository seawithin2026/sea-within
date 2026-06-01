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
        <p className="subtitle">Awaken the Fire, the Wells, the Earth within you.</p>
      </header>

      <section className="opening">
        <span>Today, the Triple Flame rises within you.</span>
        <span>The Fire that transforms.</span>
        <span>The Water that remembers.</span>
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

        {/* WATER */}
        <article className={`section ${water ? "pulse" : ""}`}>
          <div className="section-label">Aspect II</div>
          <div className="section-title water">The Well Within</div>
          <p className="section-instruction">
            Touch your stomach. Breathe into the softness.
          </p>
          <p className="section-text">
            <span>Here is your Water.</span>
            <span>The quiet place inside you that feels everything.</span>
            <span>The well that holds your memories without judgment.</span>
            <span>Let it flow. Let it soothe. Let it wash you open.</span>
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
        <span>Water to heal you.</span>
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
