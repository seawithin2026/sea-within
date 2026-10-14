"use client";
import "./day11.css";

export default function Day11Page() {
  return (
    <div className="day11-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO */}
      {/* -------------------------------------------------- */}
      <section className="day11-hero">
        <video
          src="/video-season2/day-11.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day11-hero-video"
        />

        <div className="day11-hero-overlay">
          <p className="day11-hero-tag">SEASON 2 · DAY 11</p>
          <h1 className="day11-hero-title">Touch the Earth</h1>
          <p className="day11-hero-subtitle">Ground · Settle · Return</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="opening cinematic-opening">
        <span>Your body remembers the earth — the ground that held every ancestor, every story, every beginning.</span>
        <span>Today, you follow a mythic lineage inspired by ancient earth‑contact practices, where touching the ground restored calm and clarity.</span>
        <span>Place your hand on the earth, a stone, a tree, or the floor beneath you.</span>
        <span className="mt">Let the weight of the world meet the weight of your hand.</span>
        <span>This ritual returns you to something older than thought — something steady, quiet, and real.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT TECHNIQUES GRID — MYTHIC REALISM */}
      {/* -------------------------------------------------- */}
      <section className="day11-grid">

        {/* BODY — THE GROUND TOUCH */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season2/day11-body.mp4" />
            </video>
          </div>
          <p className="grid-title water">THE GROUND TOUCH</p>
          <p className="grid-text">
            Inspired by ancient human grounding practices where physical contact calmed the body.
          </p>

          <div className="element-paragraph">
            <p>Place your hand on