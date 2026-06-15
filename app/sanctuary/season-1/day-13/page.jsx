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
            {/* ELEMENTS (unchanged) */}
            {/* 1 — Sun‑Infused Water */}
            <div className="element">
              <div className="elementMedia">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 0.6)}
                  style={{ objectFit: "cover", objectPosition: "50% 20%" }}
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
                  style={{ objectFit: "cover", objectPosition: "50% 20%" }}
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
                  style={{ filter: "brightness(0.85) contrast(1.05) saturate(0.9)" }}
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

        {/* -------------------------------------------------- */}
        {/* 3. RITUAL TEXT */}
        {/* -------------------------------------------------- */}
        <section className="ritualText">
          <h2 className="ritualHeading">The Ceremonial Rebirth</h2>

          <div className="ritualText">
            <p>
              Step into the warm bath and let the water rise around you, quiet and luminous.
              This is your sanctuary, a place where the world loosens its grip and you return
              to the center of yourself.
            </p>

            <p>
              Beside you rest the two bowls you prepared: one warmed beneath the sun, one
              softened under the moon. Covered as they infused, touched only by light, each
              bowl carries its own memory, its own quiet power.
            </p>

            <p>
              Lift the sun bowl first. Before you pour, let a single drop fall onto the crown
              of your head. Feel it move through you. It cleanses the body, releasing the
              weight you have carried, the tension you forgot you were holding, the heaviness
              that settled into you without permission.
            </p>

            <p>
              Lift the moon bowl next. Let a single drop fall. It cleanses the mind, softening
              the thoughts that have grown sharp, quieting the doubts that echo too loudly,
              clearing the sky within you so something gentler can breathe again.
            </p>

            <p>
              When both waters have touched you, combine them into a single bowl. As they meet,
              the surface shimmers as if day and night have woven themselves together, strength
              and softness held in perfect balance.
            </p>

            <p>
              Raise the unified bowl. As the water pours over you, it moves like a blessing,
              warm, gentle, alive. It carries away the stories you have outgrown, the versions
              of yourself you no longer need, the echoes of old chapters that no longer belong
              to the person you are becoming.
            </p>

            <p>
              Each droplet becomes a release. A soft unbinding. A quiet return to the truth of
              your being. You feel lighter, clearer, brighter, as though something inside you
              has finally unclenched and let the light in.
            </p>

            <p>
              You are not breaking open. You are unfolding.
              You are not changing. You are remembering.
              You are not becoming someone new. You are becoming someone true.
            </p>

            <p>
              In this warm, glowing moment, something rises within you with the gentleness of
              dawn. A steadiness you can trust. A softness that feels like strength. A light
              that belongs to you alone.
            </p>

            <p>
              You emerge from this ritual renewed, radiant, alive in a way that feels deeper
              than breath. You step forward as a self who walks with clarity, moves with
              intention, and knows the worth that has always lived within you.
            </p>

            <p>
              You rise from the water reborn, whole, luminous, beautifully unstoppable.
            </p>

            <p>
              Welcome home, beautiful soul.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
