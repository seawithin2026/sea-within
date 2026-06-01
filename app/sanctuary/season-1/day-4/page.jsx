"use client";
import { useState } from "react";
import "./day4.css";

export default function Day4Page() {
  const [breath, setBreath] = useState(false);
  const [dome, setDome] = useState(false);
  const [seal, setSeal] = useState(false);

  const allActive = breath && dome && seal;

  const activate = (setter) => setter(true);

  const unify = () => {
    setBreath(true);
    setDome(true);
    setSeal(true);
  };

  return (
    <div
      className={`day4-page 
        ${breath ? "breath-active" : ""} 
        ${dome ? "dome-active" : ""} 
        ${seal ? "seal-active" : ""} 
        ${allActive ? "unified" : ""}`}
    >
      {/* Ambient Glows */}
      <div className="glow aura"></div>
      <div className="glow dome"></div>

      <header className="header">
        <div className="tag">
          <span className="tag-dot"></span>
          <span>Sea Within · Day 4</span>
        </div>
        <h1 className="title">The Protection Ritual</h1>
        <p className="subtitle">Seal your inner power in a dome of light.</p>
      </header>

      {/* Opening */}
      <section className="opening">
        <span>Today, you draw a circle around your becoming.</span>
        <span>A boundary of light. A shield of truth.</span>
        <span className="mt">What rises within you is sacred.</span>
        <span>And today, you protect it.</span>
      </section>

      <section className="sections">
        {/* STEP I — BREATH */}
        <article className={`section ${breath ? "pulse" : ""}`}>
          <div className="section-label">Step I</div>
          <div className="section-title air">The Breath That Builds the Shield</div>
          <p className="section-instruction">
            Inhale slowly. Let your breath expand outward like a force field.
          </p>
          <p className="section-text">
            <span>With every inhale, your power gathers.</span>
            <span>With every exhale, your space becomes untouchable.</span>
            <span>Your breath is not just air —</span>
            <span>it is the architecture of your protection.</span>
          </p>
          <button className="btn btn-air" onClick={() => activate(setBreath)}>
            <span className="dot"></span>
            Breathe the Shield
          </button>
        </article>

        {/* STEP II — DOME */}
        <article className={`section ${dome ? "pulse" : ""}`}>
          <div className="section-label">Step II</div>
          <div className="section-title light">The Dome of Light</div>
          <p className="section-instruction">
            Visualize a sphere of light rising around your body.
          </p>
          <p className="section-text">
            <span>Now the dome forms.</span>
            <span>A shimmering sphere of your own energy.</span>
            <span>It rises from your feet.</span>
            <span>It curves over your head.</span>
            <span>It seals behind your spine.</span>
            <span className="mt">Nothing heavy can cross this threshold.</span>
            <span>Nothing that drains you can enter.</span>
            <span className="mt">This is your sanctuary.</span>
            <span>This is your sovereignty.</span>
          </p>
          <button className="btn btn-light" onClick={() => activate(setDome)}>
            <span className="dot"></span>
            Raise the Dome
          </button>
        </article>

        {/* STEP III — SEAL */}
        <article className={`section ${seal ? "pulse" : ""}`}>
          <div className="section-label">Step III</div>
          <div className="section-title seal">The Seal of Protection</div>
          <p className="section-instruction">
            Place your hand over your heart.
          </p>
          <p className="section-text">
            <span>By your breath, you are protected.</span>
            <span>By your light, you are shielded.</span>
            <span>By your truth, you are untouchable.</span>
            <span className="mt">Your inner flame is yours alone.</span>
            <span>Your energy answers to no one.</span>
            <span className="mt">What rises within you is sealed in light.</span>
          </p>
          <button className="btn btn-seal" onClick={() => activate(setSeal)}>
            <span className="dot"></span>
            Seal the Light
          </button>
        </article>
      </section>

      {/* Unification */}
      <section className="unification">
        <span>Breath to build the shield.</span>
        <span>Light to form the dome.</span>
        <span>Truth to seal your power.</span>
        <span className="mt">Three forces. One protection.</span>
        <span className="mt">Your dome is complete.</span>
        <span>Your path is protected.</span>

        <div className="unification-symbol"></div>

        <button className="btn btn-main" onClick={unify}>
          Activate the Dome
        </button>
      </section>

      <footer className="closing">
        <span>Your light is sealed.</span>
        <span>Your energy is your own.</span>
        <span>Return tomorrow. The journey continues.</span>
      </footer>
    </div>
  );
}
