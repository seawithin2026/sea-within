"use client";

import React from "react";
import "./day1.css";

export default function Day1Page() {
  return (
    <>
      {/* -------------------------------------------------- */}
      {/* 1. CINEMATIC HERO (FULL WIDTH, 80VH) */}
      {/* -------------------------------------------------- */}
      <section className="day1-hero">
        <video className="day1-hero-video" autoPlay muted loop playsInline>
          <source src="/video-season1/day-1.mp4" type="video/mp4" />
        </video>

        {/* OVERLAY CONTENT */}
        <div className="day1-hero-overlay">
          <div className="day1-circle">
            <p className="day1-season">SEASON 1 — DAY 1</p>
            <h1 className="day1-title">Water Purification Ritual</h1>
            <p className="day1-tagline">A return to clarity, softness, and release</p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. MAIN CONTENT (CENTERED CONTAINER) */}
      {/* -------------------------------------------------- */}
      <div className="day1-content">
        <section className="ritualElements">
          <h2 className="elementsTitle">The Elements You Bring Into the Water</h2>

          <div className="elementsGrid">

            {/* 1 — Sun‑Infused Water */}
            <div className="element">
              <div className="elementMedia">
                <video autoPlay muted loop playsInline>
                  <source src="/ritual-elements/day1/sun-infused-water.mp4" />
                </video>
              </div>
              <p className="elementTitle">Sun‑Infused Water</p>
              <p className="elementText">Water warmed by the day, carrying the memory of light.</p>
            </div>

            {/* 2 — Moon‑Infused Water */}
            <div className="element">
              <div className="elementMedia">
                <video autoPlay muted loop playsInline>
                  <source src="/ritual-elements/day1/moon-infused-water.mp4" />
                </video>
              </div>
              <p className="elementTitle">Moon‑Infused Water</p>
              <p className="elementText">Water cooled by the night, carrying the memory of calm.</p>
            </div>

            {/* 3 — Flower Petals */}
            <div className="element">
              <div className="elementMedia">
                <video autoPlay muted loop playsInline>
                  <source src="/ritual-elements/day1/flower-petals.mp4" />
                </video>
              </div>
              <p className="elementTitle">Flower Petals</p>
              <p className="elementText">A soft offering to the water — beauty returning to beauty.</p>
            </div>

            {/* 4 — Epsom Salt */}
     <div className="element">
  <div className="elementMedia">
    <video
      autoPlay
      muted
      loop
      playsInline
      onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.6)}
    >
      <source src="/ritual-elements/day1/epsom-salt.mp4" />
    </video>
  </div>
  <p className="elementTitle">Epsom Salt</p>
  <p className="elementText">Mineral release. A quiet unburdening.</p>
</div>



            {/* 5 — Bath Oil */}
            <div className="element">
              <div className="elementMedia">
                <video autoPlay muted loop playsInline>
                  <source src="/ritual-elements/day1/bath-oil.mp4" />
                </video>
              </div>
              <p className="elementTitle">Bath Oil</p>
              <p className="elementText">A touch of nourishment for the skin.</p>
            </div>

            {/* 6 — Favorite Scent */}
            <div className="element">
              <div className="elementMedia">
                <video autoPlay muted loop playsInline>
                  <source src="/ritual-elements/day1/favorite-scent.mp4" />
                </video>
              </div>
              <p className="elementTitle">Your Favorite Scent</p>
              <p className="elementText">A fragrance that feels like home.</p>
            </div>

            {/* 7 — Safe Light */}
            <div className="element">
              <div className="elementMedia">
                <video autoPlay muted loop playsInline>
                  <source src="/ritual-elements/day1/safe-light.mp4" />
                </video>
              </div>
              <p className="elementTitle">A Light That Doesn’t Burn</p>
              <p className="elementText">A soft, flameless glow — safe for any space.</p>
            </div>

            {/* 8 — Music */}
            <div className="element">
              <div className="elementMedia">
                <video autoPlay muted loop playsInline>
                  <source src="/ritual-elements/day1/music-ambience.mp4" />
                </video>
              </div>
              <p className="elementTitle">Music</p>
              <p className="elementText">A soundscape to soften the world around you.</p>
            </div>

          </div>
        </section>

        {/* BATH HERO */}
        <section className="bathHero">
          <video className="bathVideo" autoPlay muted loop playsInline>
            <source src="/video-season1/day1-bath.mp4" type="video/mp4" />
          </video>
        </section>

        {/* RITUAL TEXT */}
        <section className="ritualText">
          <div className="ritualTextInner">
            <h2 className="ritualHeading">The Rebirth</h2>

            <p className="ritualParagraph">
              The water glows in your hands, holding the last traces of who you were
              before this moment found you.
            </p>

            <p className="ritualParagraph">
              The room is silent now. Even the air seems to wait.
            </p>

            <p className="ritualParagraph">
              You lift the bowl slowly, as if raising an offering to something ancient
              that has been watching you from the beginning.
            </p>

            <p className="ritualParagraph">
              And when the bowl reaches the space above your head, the world holds its breath.
            </p>

            <p className="ritualParagraph">
              Droplets fall in slow motion — each one a piece of the past breaking away
              from your body, falling back into the earth where it can no longer follow you.
            </p>

            <p className="ritualParagraph">
              In this suspended moment, something inside you cracks open. Not in pain —
              in revelation.
            </p>

            <p className="ritualParagraph">
              You feel yourself returning to the raw, unfiltered version of you that
              existed before the world named you, before expectations shaped you, before
              you learned to dim your own light.
            </p>

            <p className="ritualParagraph">
              Here, in the glow of this rebirth, you are untouched. Unburdened. Unmasked.
            </p>

            <p className="ritualParagraph">
              You are born again into a new light — a light that recognizes you, a light
              that has been waiting.
            </p>

            <p className="ritualParagraph">
              <strong>Welcome, beautiful Soul. The world will never see you the same way again.</strong>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
