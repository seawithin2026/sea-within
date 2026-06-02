"use client";
import { useState } from "react";
import "./day5.css";

export default function Day5Page() {
  const [awakening, setAwakening] = useState(false);
  const [remembering, setRemembering] = useState(false);
  const [expanding, setExpanding] = useState(false);

  const allActive = awakening && remembering && expanding;

  const activate = (setter) => setter(true);

  const unify = () => {
    setAwakening(true);
    setRemembering(true);
    setExpanding(true);
  };

  return (
    <div
      className={`day5-page 
        ${awakening ? "awakening-active" : ""} 
        ${remembering ? "remembering-active" : ""} 
        ${expanding ? "expanding-active" : ""} 
        ${allActive ? "unified" : ""}`}
    >

      {/* HERO VIDEO */}
      <section className="relative w-full h-[130vh] overflow-hidden day5-hero">
        <video
          src="/video-season1/day-5.mp4"
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
            Sea Within · Day 5
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
            Breath of Life Ritual
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
            A ritual safe for everyone. A return to your first yes.
          </p>
        </div>
      </section>

      {/* Ambient Glows */}
      <div className="glow breath"></div>
      <div className="glow life"></div>

      <header className="header">
        <div className="tag">
          <span className="tag-dot"></span>
          <span>Sea Within · Day 5</span>
        </div>
        <h1 className="title">The Breath of Life</h1>
        <p className="subtitle">A ritual safe for everyone. A return to your first yes.</p>
      </header>

      {/* Opening */}
      <section className="opening">
        <span>Before you spoke a word, before you opened your eyes,</span>
        <span>your breath arrived.</span>
        <span className="mt">It was the first yes your body ever gave the world.</span>
        <span>The moment life chose you — and you chose it back.</span>
        <span className="mt">Today, you return to that yes.</span>
      </section>

      <section className="sections">

        {/* STEP I — AWAKENING BREATH */}
        <article className={`section ${awakening ? "pulse" : ""}`}>
          <div className="section-label">Step I</div>
          <div className="section-title breath">The Birth-Breath</div>
          <p className="section-instruction">
            Take one slow inhale, as if it were your very first.
          </p>
          <p className="section-text">
            <span>Let this breath rise like dawn inside you.</span>
            <span>Feel it push open the doors of your ribs.</span>
            <span>Feel it stretch the quiet corners of your lungs.</span>
            <span>Feel it awaken the places inside you that have been sleeping.</span>
            <span className="mt">This is not just air.</span>
            <span>This is your arrival.</span>
          </p>
          <button className="btn btn-breath" onClick={() => activate(setAwakening)}>
            <span className="dot"></span>
            Awaken
          </button>
        </article>

        {/* STEP II — REMEMBERING BREATH */}
        <article className={`section ${remembering ? "pulse" : ""}`}>
          <div className="section-label">Step II</div>
          <div className="section-title remembering">The Breath That Remembers</div>
          <p className="section-instruction">
            Exhale slowly, like you’re releasing centuries of tension.
          </p>
          <p className="section-text">
            <span>Let the exhale fall out of you like a truth you’ve held too long.</span>
            <span>Feel your shoulders drop.</span>
            <span>Feel your jaw soften.</span>
            <span>Feel your heart unclench.</span>
            <span className="mt">Your body remembers how to let go.</span>
            <span>It has always known.</span>
          </p>
          <button className="btn btn-remembering" onClick={() => activate(setRemembering)}>
            <span className="dot"></span>
            Release
          </button>
        </article>

        {/* STEP III — EXPANDING BREATH */}
        <article className={`section ${expanding ? "pulse" : ""}`}>
          <div className="section-label">Step III</div>
          <div className="section-title expanding">The Breath That Expands Your Light</div>
          <p className="section-instruction">
            Imagine your breath glowing — a soft, expanding light inside your body.
          </p>
          <p className="section-text">
            <span>With every inhale, your light grows brighter.</span>
            <span>With every exhale, your energy rises higher.</span>
            <span>Feel your chest become a lantern.</span>
            <span>Feel your spine become a pillar.</span>
            <span>Feel your whole body become a vessel of living light.</span>
            <span className="mt">This is the breath of life.</span>
            <span>And it is waking you.</span>
          </p>
          <button className="btn btn-expanding" onClick={() => activate(setExpanding)}>
            <span className="dot"></span>
            Expand
          </button>
        </article>

      </section>

      {/* Unification */}
      <section className="unification">
        <span>Awakening breath.</span>
        <span>Remembering breath.</span>
        <span>Expanding breath.</span>
        <span className="mt">Three breaths. One life.</span>
        <span className="mt">You are awake.</span>
        <span>You are here.</span>

        <div className="unification-symbol"></div>

        <button className="btn btn-main" onClick={unify}>
          Breathe Into Life
        </button>
      </section>

      <footer className="closing">
        <span>Your breath is your anchor.</span>
        <span>Your breath is your power.</span>
        <span>Your breath is your life.</span>
        <span>Return tomorrow.</span>
      </footer>
    </div>
  );
}
