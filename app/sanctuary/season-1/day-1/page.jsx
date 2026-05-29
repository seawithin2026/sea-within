"use client";

import React from "react";

export default function Day1Page() {
  return (
    <div className="day1">

      {/* -------------------------------------------------- */}
      {/* 1. HERO VIDEO (YOUR ORIGINAL VIDEO + NEW TITLE) */}
      {/* -------------------------------------------------- */}
      <section className="hero">
        <video className="heroVideo" autoPlay muted loop playsInline>
          <source src="/video-season1/day-1.mp4" type="video/mp4" />
        </video>

        <div className="heroOverlay">
          <p className="heroSeason">SEASON 1 — DAY 1</p>
          <h1 className="heroTitle">Water Purification Ritual</h1>
          <p className="heroTagline">A return to clarity, softness, and release</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. RITUAL ELEMENTS GRID (8 ITEMS, 4 PER ROW) */}
      {/* -------------------------------------------------- */}
      <section className="ritualElements">
        <h2 className="elementsTitle">The Elements You Bring Into the Water</h2>

        <div className="elementsGrid">

          {/* Row 1 */}
          <div className="element">
            <div className="elementMedia"></div>
            <p className="elementTitle">Sun‑Infused Water</p>
            <p className="elementText">Water warmed by the day, carrying the memory of light.</p>
          </div>

          <div className="element">
            <div className="elementMedia"></div>
            <p className="elementTitle">Moon‑Infused Water</p>
            <p className="elementText">Water cooled by the night, carrying the memory of calm.</p>
          </div>

          <div className="element">
            <div className="elementMedia"></div>
            <p className="elementTitle">Flower Petals</p>
            <p className="elementText">A soft offering to the water — beauty returning to beauty.</p>
          </div>

          <div className="element">
            <div className="elementMedia"></div>
            <p className="elementTitle">Epsom Salt</p>
            <p className="elementText">Mineral release. A quiet unburdening.</p>
          </div>

          {/* Row 2 */}
          <div className="element">
            <div className="elementMedia"></div>
            <p className="elementTitle">Bath Oil</p>
            <p className="elementText">A touch of nourishment for the skin.</p>
          </div>

          <div className="element">
            <div className="elementMedia"></div>
            <p className="elementTitle">Your Favorite Scent</p>
            <p className="elementText">A fragrance that feels like home.</p>
          </div>

          <div className="element">
            <div className="elementMedia"></div>
            <p className="elementTitle">A Light That Doesn’t Burn</p>
            <p className="elementText">A soft, flameless glow — safe for any space.</p>
          </div>

          <div className="element">
            <div className="elementMedia"></div>
            <p className="elementTitle">Music</p>
            <p className="elementText">A soundscape to soften the world around you.</p>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. SECOND HERO VIDEO — BATH SCENE */}
      {/* -------------------------------------------------- */}
      <section className="bathHero">
        <video className="bathVideo" autoPlay muted loop playsInline>
          <source src="/videos/day1-bath.mp4" type="video/mp4" />
        </video>
      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CINEMATIC RITUAL TEXT BLOCK */}
      {/* -------------------------------------------------- */}
      <section className="ritualText">
        <div className="ritualTextInner">
          <h2 className="ritualHeading">The Descent</h2>

          <p className="ritualParagraph">
            Begin with water — not as a task, but as a return.  
            Let the room dim. Let the world soften.  
            Let this moment belong only to you.
          </p>

          <p className="ritualParagraph">
            Touch the surface.  
            Feel the warmth rise into your skin.  
            Let the water hold what you no longer want to carry.
          </p>

          <p className="ritualParagraph">
            Cleanse slowly — across your face, your neck, your hands —  
            as if you’re washing away a story that no longer belongs to you.
          </p>

          <p className="ritualParagraph">
            Whisper what you’re ready to release.  
            Let it dissolve into the water.  
            Let it leave your body gently.
          </p>

          <p className="ritualParagraph">
            When you’re ready, lift your hands.  
            The ritual is complete.  
            The quiet that remains is yours.
          </p>
        </div>
      </section>

    </div>
  );
}
