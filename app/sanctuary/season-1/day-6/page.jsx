"use client";
import { useState } from "react";
import "./day6.css";

export default function Day6Page() {
  const [arrival, setArrival] = useState(false);
  const [gathering, setGathering] = useState(false);
  const [rooting, setRooting] = useState(false);
  const [expansion, setExpansion] = useState(false);

  const allActive = arrival && gathering && rooting && expansion;

  const activate = (setter) => setter(true);

  const unify = () => {
    setArrival(true);
    setGathering(true);
    setRooting(true);
    setExpansion(true);
  };

  return (
    <div
      className={`day6-page 
        ${arrival ? "arrival-active" : ""} 
        ${gathering ? "gathering-active" : ""} 
        ${rooting ? "rooting-active" : ""} 
        ${expansion ? "expansion-active" : ""} 
        ${allActive ? "unified" : ""}`}
    >

      {/* HERO VIDEO */}
      <section className="relative w-full h-[130vh] overflow-hidden day6-hero">
        <video
          src="/video-season1/day-6.mp4"
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
            Sea Within · Day 6
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
            The Ancient Sun Greeting Ritual
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
            A ritual of gathering energy through the body.
          </p>
        </div>
      </section>

      {/* Ambient Glows */}
      <div className="glow sun"></div>
      <div className="glow earth"></div>

      <header className="header">
        <div className="tag">
          <span className="tag-dot"></span>
          <span>Sea Within · Day 6</span>
        </div>
        <h1 className="title">The Ancient Sun Greeting</h1>
        <p className="subtitle">A ritual of gathering energy through the body.</p>
      </header>

      {/* Opening */}
      <section className="opening">
        <span>Long before language, long before ritual had names,</span>
        <span>humans greeted the sun.</span>
        <span className="mt">Not as a god.</span>
        <span>Not as a symbol.</span>
        <span className="mt">But as the first warmth that ever touched their skin.</span>
        <span>The first light that ever opened their eyes.</span>
        <span className="mt">Today, you stand in that lineage.</span>
        <span>Today, you greet the ancient sun.</span>
      </section>

      <section className="sections">

        {/* STEP I — ARRIVAL */}
        <article className={`section ${arrival ? "pulse" : ""}`}>
          <div className="section-label">Step I</div>
          <div className="section-title arrival">The Arrival</div>
          <p className="section-instruction">
            Step outside. Stop moving. Let the world meet you.
          </p>
          <p className="section-text">
            <span>Feel the air wrap around you.</span>
            <span>Feel the temperature settle on your skin.</span>
            <span className="mt">Don’t reach for the sun.</span>
            <span>Let it reach for you.</span>
            <span className="mt">Let the light land on your face</span>
            <span>the way it has landed on every human who ever lived.</span>
            <span className="mt">This is the oldest greeting in the world.</span>
            <span>And your body remembers it.</span>
          </p>
          <button className="btn btn-arrival" onClick={() => activate(setArrival)}>
            <span className="dot"></span>
            Arrive
          </button>
        </article>

        {/* STEP II — GATHERING */}
        <article className={`section ${gathering ? "pulse" : ""}`}>
          <div className="section-label">Step II</div>
          <div className="section-title gathering">The Gathering</div>
          <p className="section-instruction">
            Take a slow inhale. Let your skin soften.
          </p>
          <p className="section-text">
            <span>Feel the warmth enter you through your cheeks.</span>
            <span>Feel it slide down your throat.</span>
            <span>Feel it settle behind your sternum like a glowing seed.</span>
            <span className="mt">This is not imagination.</span>
            <span>This is sensation.</span>
            <span className="mt">Your skin is drinking light.</span>
            <span>Your breath is pulling it deeper.</span>
            <span className="mt">You are gathering the sun</span>
            <span>the way your ancestors did — with your body, not your mind.</span>
          </p>
          <button className="btn btn-gathering" onClick={() => activate(setGathering)}>
            <span className="dot"></span>
            Gather
          </button>
        </article>

        {/* STEP III — ROOTING */}
        <article className={`section ${rooting ? "pulse" : ""}`}>
          <div className="section-label">Step III</div>
          <div className="section-title rooting">The Rooting</div>
          <p className="section-instruction">
            Feel your feet on the ground. Let your weight drop.
          </p>
          <p className="section-text">
            <span>Feel the earth hold you.</span>
            <span>Feel the ground rise to meet your weight.</span>
            <span className="mt">The steadier your legs become,</span>
            <span>the more safely your chest opens.</span>
            <span className="mt">Let the warmth you gathered sink into your belly,</span>
            <span>your hips, your bones.</span>
            <span className="mt">You are standing where sky and soil meet.</span>
            <span>You are the meeting point.</span>
            <span>You are the vessel.</span>
          </p>
          <button className="btn btn-rooting" onClick={() => activate(setRooting)}>
            <span className="dot"></span>
            Root
          </button>
        </article>

        {/* STEP IV — EXPANSION */}
        <article className={`section ${expansion ? "pulse" : ""}`}>
          <div className="section-label">Step IV</div>
          <div className="section-title expansion">The Expansion</div>
          <p className="section-instruction">
            Take a few natural breaths. Let the warmth move on its own.
          </p>
          <p className="section-text">
            <span>With each breath, feel the warmth shift.</span>
            <span>Maybe it spreads across your chest.</span>
            <span>Maybe it tingles in your hands.</span>
            <span>Maybe it hums low in your belly.</span>
            <span className="mt">Whatever you feel is real.</span>
            <span>Whatever you feel is enough.</span>
            <span className="mt">You are not imagining light.</span>
            <span>You are absorbing it.</span>
            <span className="mt">You are a body made of warmth,</span>
            <span>charged by the world itself.</span>
            <span className="mt">This is the ancient sun greeting you back.</span>
          </p>
          <button className="btn btn-expansion" onClick={() => activate(setExpansion)}>
            <span className="dot"></span>
            Expand
          </button>
        </article>

      </section>

      {/* Unification */}
      <section className="unification">
        <span>Arrival.</span>
        <span>Gathering.</span>
        <span>Rooting.</span>
        <span>Expansion.</span>
        <span className="mt">Four steps. One awakening.</span>
        <span className="mt">You are charged.</span>

        <div className="unification-symbol"></div>

        <button className="btn btn-main" onClick={unify}>
          Greet the Sun
        </button>
      </section>

      <footer className="closing">
        <span>The sun has touched you.</span>
        <span>The earth has held you.</span>
        <span>Your body has gathered what it was ready to receive.</span>
        <span>Return tomorrow.</span>
      </footer>
    </div>
  );
}
