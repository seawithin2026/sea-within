"use client";
import { useState } from "react";
import "./day3.css";

export default function Day3Page() {
  const [breath, setBreath] = useState(false);
  const [touch, setTouch] = useState(false);
  const [ground, setGround] = useState(false);

  const allActive = breath && touch && ground;

  const activate = (setter) => {
    setter(true);
  };

  const unify = () => {
    setBreath(true);
    setTouch(true);
    setGround(true);
  };

  return (
    <div
      className={`day3-page 
        ${breath ? "breath-active" : ""} 
        ${touch ? "touch-active" : ""} 
        ${ground ? "ground-active" : ""} 
        ${allActive ? "unified" : ""}`}
    >
      {/* Ambient Glows */}
      <div className="glow earth"></div>
      <div className="glow deep"></div>

      <header className="header">
        <div className="tag">
          <span className="tag-dot"></span>
          <span>Sea Within · Day 3</span>
        </div>
        <h1 className="title">The Grounding Ritual</h1>
        <p className="subtitle">Return to the body. Return to the Earth.</p>
      </header>

      <section className="opening">
        <span>Today, you return to the ground beneath you.</span>
        <span>The place that has carried you through every ending.</span>
        <span>The place that knows your weight and welcomes it.</span>
        <span className="mt">This is where you land.</span>
      </section>

      <section className="sections">

        {/* ROOTING BREATH */}
        <article className={`section ${breath ? "pulse" : ""}`}>
          <div className="section-label">Step I</div>
          <div className="section-title earth">The Rooting Breath</div>
          <p className="section-instruction">
            Place your hand on your belly. Breathe deep into your lower body.
          </p>
          <p className="section-text">
            <span>Feel your breath drop lower.</span>
            <span>Feel your body settle.</span>
            <span>Feel yourself arrive.</span>
          </p>
          <button className="btn btn-earth" onClick={() => activate(setBreath)}>
            <span className="dot"></span>
            Root
          </button>
        </article>

        {/* TOUCH OF EARTH */}
        <article className={`section ${touch ? "pulse" : ""}`}>
          <div className="section-label">Step II</div>
          <div className="section-title earth">The Touch of Earth</div>
          <p className="section-instruction">
            Touch something solid — your legs, the floor, a stone, the chair beneath you.
          </p>
          <p className="section-text">
            <span>Here is your Earth.</span>
            <span>The strength beneath your softness.</span>
            <span>The ground that holds your becoming.</span>
            <span>Let it steady you.</span>
          </p>
          <button className="btn btn-earth" onClick={() => activate(setTouch)}>
            <span className="dot"></span>
            Connect
          </button>
        </article>

        {/* GROUNDING GESTURE */}
        <article className={`section ${ground ? "pulse" : ""}`}>
          <div className="section-label">Step III</div>
          <div className="section-title earth">The Grounding Gesture</div>
          <p className="section-instruction">
            Place both feet firmly on the ground.
          </p>
          <p className="section-text">
            <span>Feel the weight of your body.</span>
            <span>Feel the support beneath you.</span>
            <span>Feel how nothing is asked of you in this moment.</span>
            <span>You are allowed to rest here.</span>
          </p>
          <button className="btn btn-earth" onClick={() => activate(setGround)}>
            <span className="dot"></span>
            Ground
          </button>
        </article>

      </section>

      <section className="unification">
        <span>Breath to settle you.</span>
        <span>Touch to anchor you.</span>
        <span>Earth to hold you.</span>
        <span className="mt">Three steps. One return.</span>
        <span className="mt">Today, you are grounded.</span>
        <span>You are here.</span>

        <div className="unification-symbol"></div>

        <button className="btn btn-main" onClick={unify}>
          Become Grounded
        </button>
      </section>

      <footer className="closing">
        <span>You are held.</span>
        <span>You are here.</span>
        <span>The journey continues.</span>
      </footer>
    </div>
  );
}
