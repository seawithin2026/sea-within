"use client";

import React from "react";
import "./day13.css";

export default function Day13Page() {
  return (
    <>
      {/* -------------------------------------------------- */}
      {/* 1. CINEMATIC HERO (FULL WIDTH, 80VH) */}
      {/* -------------------------------------------------- */}
      <section className="day13-hero">
  <video className="day13-hero-video" autoPlay muted loop playsInline>
    <source src="/video-season1/day-13.mp4" type="video/mp4" />
  </video>

  <div className="day13-hero-overlay">
    <p className="day13-hero-tag">SEA WITHIN · DAY 13</p>
    <h1 className="day13-hero-title">The Ceremonial Rebirth</h1>
    <p className="day13-hero-subtitle">Return to Your Luminous Self</p>
  </div>
</section>

      {/* -------------------------------------------------- */}
      {/* 2. MAIN CONTENT (CENTERED CONTAINER) */}
      {/* -------------------------------------------------- */}
      <div className="day13-content">
        <section className="ritualElements">
          <h2 className="elementsTitle">The Elements You Bring Into the Water</h2>

          <div className="elementsGrid">

            {/* 1 — Sun‑Infused Water */}
            <div className="element">
              <div className="elementMedia">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.6)}
                  style={{
                    objectFit: "cover",
                    objectPosition: "50% 20%",
                  }}
                >
                  <source src="/ritual-elements/day13/sun-infused-water.mp4" />
                </video>
              </div>
              <p className="elementTitle">Sun‑Infused Water</p>
              <p className="elementText">
                Place one bowl of water in the sun for the day — covered, so only the light touches it.
              </p>
            </div>

            {/* 2 — Moon‑Infused Water */}
            <div className="element">
              <div className="elementMedia">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.6)}
                  style={{
                    objectFit: "cover",
                    objectPosition: "50% 20%",
                  }}
                >
                  <source src="/ritual-elements/day13/moon-infused-water.mp4" />
                </video>
              </div>
              <p className="elementTitle">Moon‑Infused Water</p>
              <p className="elementText">
                Place another bowl in the moonlight — covered, so only the light touches it.
              </p>
            </div>

            {/* 3 — Flower Petals */}
            <div className="element">
              <div className="elementMedia">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    filter: "brightness(0.85) contrast(1.05) saturate(0.9)",
                  }}
                >
                  <source src="/ritual-elements/day13/flower-petals.mp4" />
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
                  <source src="/ritual-elements/day13/epsom-salt.mp4" />
                </video>
              </div>
              <p className="elementTitle">Epsom Salt</p>
              <p className="elementText">Mineral release. A quiet unburdening.</p>
            </div>

            {/* 5 — Bath Oil */}
            <div className="element">
              <div className="elementMedia">
                <video autoPlay muted loop playsInline>
                  <source src="/ritual-elements/day13/bath-oil.mp4" />
                </video>
              </div>
              <p className="elementTitle">Bath Oil</p>
              <p className="elementText">A touch of nourishment for the skin.</p>
            </div>

            {/* 6 — Favorite Scent */}
            <div className="element">
              <div className="elementMedia">
                <video autoPlay muted loop playsInline>
                  <source src="/ritual-elements/day13/favorite-scent.mp4" />
                </video>
              </div>
              <p className="elementTitle">Your Favorite Scent</p>
              <p className="elementText">A fragrance that feels like home.</p>
            </div>

            {/* 7 — Safe Light */}
            <div className="element">
              <div className="elementMedia">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.4)}
                >
                  <source src="/ritual-elements/day13/safe-light.mp4" />
                </video>
              </div>
              <p className="elementTitle">A Light That Doesn’t Burn</p>
              <p className="elementText">A soft, flameless glow — safe for any space.</p>
            </div>

            {/* 8 — Music */}
            <div className="element">
              <div className="elementMedia">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.6)}
                >
                  <source src="/ritual-elements/day13/music-ambience.mp4" />
                </video>
              </div>
              <p className="elementTitle">Music</p>
              <p className="elementText">A soundscape to soften the world around you.</p>
            </div>

          </div>
        </section>


        {/* RITUAL TEXT */}
        <section className="ritualText">
          <div className="ritualTextInner">
            <h2 className="ritualHeading">The Ceremonial Rebirth</h2>

            <p className="ritualParagraph">
              Step into the warm bath and let the water settle around you. 
              This is your sanctuary — a quiet, glowing space where the world softens 
              and you return to yourself.
            </p>

            <p className="ritualParagraph">
              Beside you rests the bowl you prepared: one part warmed by the sun, 
              one part softened by the moon. Covered as they infused, touched only by light, 
              the water now carries the memory of both worlds.
            </p>

            <p className="ritualParagraph">
              Lift the bowl gently. Before you pour, let a single drop of the 
              <strong>sun‑infused water</strong> fall onto the crown of your head.
              This drop cleanses the <strong>body</strong> — releasing tension, heaviness, 
              and everything your skin has carried for too long.
            </p>

            <p className="ritualParagraph">
              Then let a single drop of the <strong>moon‑infused water</strong> fall.
              This drop cleanses the <strong>mind</strong> — softening old thoughts, 
              quieting doubt, clearing the inner sky.
            </p>

            <p className="ritualParagraph">
              When sun and moon have touched you, let a third drop fall — 
              the two waters now united.  
              This drop cleanses the <strong>spirit</strong> — the deepest part of you, 
              the part that remembers who you truly are.
            </p>

            <p className="ritualParagraph">
              Now raise the bowl fully. The surface shimmers — day and night woven together, 
              strength and softness in perfect balance.
            </p>

            <p className="ritualParagraph">
              As the water pours over you, it moves like a blessing — warm, gentle, alive.  
              Let it carry away the heaviness you’ve outgrown, the stories you’ve shed, 
              the versions of you that no longer fit.
            </p>

            <p className="ritualParagraph">
              Each droplet is a release. A soft unbinding. A quiet return to your truest self.  
              You feel lighter. Clearer. Brighter — as if something inside you has finally exhaled.
            </p>

            <p className="ritualParagraph">
              You are not breaking open — you are unfolding.  
              You are not changing — you are remembering.  
              You are not becoming someone new — you are becoming someone true.
            </p>

            <p className="ritualParagraph">
              In this warm, glowing moment, something rises within you with the gentleness of dawn.  
              A new steadiness. A new softness. A new light that feels unmistakably yours.
            </p>

            <p className="ritualParagraph">
              You emerge from this ritual renewed, luminous, unmistakably alive —  
              a self that walks with clarity, breathes with confidence, and knows its own worth.
            </p>

            <p className="ritualParagraph">
              <strong>You rise from the water reborn — radiant, whole, and beautifully unstoppable.</strong>
            </p>

            <p className="ritualParagraph">
              <strong>Welcome home, beautiful soul.</strong>
            </p>
          </div>
        </section>

      </div>
    </>
  );
}
