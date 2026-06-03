"use client";
import "./day3.css";

export default function Day3Page() {
  return (
    <div className="day3-wrapper">

      {/* -------------------------------------------------- */}
      {/* 1. FULL-SCREEN HERO (CINEMATIC LIKE DAY 2) */}
      {/* -------------------------------------------------- */}
      <section className="day3-hero">
        <video
          src="/video-season1/day-3.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="day3-hero-video"
        />

        <div className="day3-hero-overlay">
          <p className="day3-hero-tag">SEA WITHIN · DAY 3</p>
          <h1 className="day3-hero-title">The Grounding Ritual</h1>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* 2. OPENING POETIC TEXT */}
      {/* -------------------------------------------------- */}
      <section className="cinematic-opening">
        <span>Today, you return to the ground beneath you.</span>
        <span>The place that has carried you through every ending.</span>
        <span>The place that knows your weight and welcomes it.</span>
        <span className="mt">This is where you land.</span>
      </section>

      {/* -------------------------------------------------- */}
      {/* 3. ANCIENT GROUNDING TECHNIQUES GRID */}
      {/* -------------------------------------------------- */}
      <section className="day3-grid">

        {/* ROOTING BREATH — BREATH OF DESCENT */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day3-breath.mp4" />
            </video>
          </div>

          <p className="grid-title">The Rooting Breath</p>
          <p className="grid-text">The ancient breath of descent that returns you to your own gravity.</p>

          <div className="element-paragraph">
            <p>Bring your hand to your belly.</p>
            <p>Let your breath fall downward, as if sinking through layers of earth.</p>
            <p>With every exhale, release a little more of the weight you’ve been carrying.</p>
            <p>With every inhale, draw in the steadiness of the ground beneath you.</p>
            <p>This is the Breath of Descent — the ancient practice of letting the breath travel downward until the body remembers its own gravity.</p>
            <p>Here, you root not by force, but by surrendering to the pull of the Earth.</p>
          </div>
        </div>

        {/* TOUCH OF EARTH — STONE-HOLDING RITUAL */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day3-touch.mp4" />
            </video>
          </div>

          <p className="grid-title">The Touch of Earth</p>
          <p className="grid-text">The stone‑holding ritual that reminds you you belong to this world.</p>

          <div className="element-paragraph">
            <p>Place your hand on something solid — your thigh, the floor, a stone, the earth itself.</p>
            <p>Feel the coolness, the weight, the truth of it.</p>
            <p>Let your palm soften against it.</p>
            <p>Let the steadiness of the object travel into your hand, up your arm, into your chest.</p>
            <p>This is the Stone‑Holding Ritual — a grounding practice older than language, where humans placed their hands on the world to remember they belonged to it.</p>
            <p>Let the Earth lend you its stillness. Let it anchor the parts of you that have been drifting.</p>
          </div>
        </div>

        {/* GROUNDING GESTURE — STANDING ROOT */}
        <div className="grid-element">
          <div className="grid-media">
            <video autoPlay muted loop playsInline>
              <source src="/video-season1/day3-ground.mp4" />
            </video>
          </div>

          <p className="grid-title">The Grounding Gesture</p>
          <p className="grid-text">The standing root that lets you be held and unshaken.</p>

          <div className="element-paragraph">
            <p>Place both feet firmly on the ground.</p>
            <p>Bend your knees slightly.</p>
            <p>Let your weight drop into your legs as if roots were growing downward from your soles.</p>
            <p>Feel the Earth rise to meet you.</p>
            <p>Feel the quiet power that comes from standing your full height while letting your weight fall.</p>
            <p>This is the Standing Root — the ancient gesture of warriors, healers, and walkers of the forest.</p>
            <p>A posture that says: I am here. I am held. I am unshaken.</p>
          </div>
        </div>

      </section>

      {/* -------------------------------------------------- */}
      {/* 4. CLOSING TEXT (HORIZONTAL, LIKE DAY 2 STYLE) */}
      {/* -------------------------------------------------- */}
      <footer className="closing">
        <span>You are held.</span>
        <span>You are here.</span>
        <span>The journey continues.</span>
      </footer>

    </div>
  );
}
