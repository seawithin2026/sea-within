"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";

/* -----------------------------------------------------
   🌿 GESTURES — 20 grounding + 30 awakening (FULL SET)
----------------------------------------------------- */
const GESTURES = [
  // Grounding 20
  "Take a warm shower and feel the water on your skin for one slow breath.",
  "Drink a glass of water and notice the coolness moving through you.",
  "Step outside and let the air touch your face for a moment.",
  "Place your hand on your heart and feel one rise and fall.",
  "Hold a warm mug and feel the heat settle into your palms.",
  "Look toward a window and let your eyes rest on the light.",
  "Stretch your arms gently overhead and feel your body lengthen.",
  "Splash cool water on your face and let it wake your senses.",
  "Wrap yourself in a blanket and feel the weight settle around you.",
  "Close your eyes and listen for the quietest sound in the room.",
  "Sit down and let your shoulders soften for one slow breath.",
  "Touch your forearm gently and notice the warmth of your own skin.",
  "Stand still for a moment and feel the ground supporting you.",
  "Light a candle and watch the flame for a few seconds.",
  "Rest your back against a surface and feel it hold you.",
  "Take one slow inhale and let it land softly inside you.",
  "Gently roll your shoulders and notice where they soften.",
  "Look at something beautiful and let your eyes rest there.",
  "Place both feet flat on the floor and feel their weight.",
  "Sit quietly and notice the rhythm of your breathing.",

  // Awakening 30
  "Take a slow breath and feel your chest open just a little more than usual.",
  "Place your hand on your collarbone and feel the gentle rise beneath your touch.",
  "Stand tall for a moment and feel your whole body wake up.",
  "Let your fingertips trace your jawline and feel the warmth of your skin.",
  "Sit quietly and feel your breath deepen naturally.",
  "Place your palm over your heart and notice the quiet strength there.",
  "Let your shoulders roll back and feel the space it creates inside you.",
  "Rest your hand on your belly and feel the calm settling there.",
  "Lift your face slightly and feel the air move across your skin.",
  "Let your hands press gently together and feel the connection.",
  "Take a slow inhale and feel your ribs expand like a quiet opening.",
  "Place your hand on the side of your neck and feel the warmth of your pulse.",
  "Let your spine lengthen and feel the energy rise through your body.",
  "Rest your hand on your chest and feel the softness beneath your palm.",
  "Let your breath fill your lower belly and feel the grounding.",
  "Place your fingertips on your temples and feel the tension melt.",
  "Sit still and feel your breath move all the way down your body.",
  "Let your eyes soften and feel the calm behind them.",
  "Place your hand on your shoulder and feel the warmth spread.",
  "Take a slow breath and feel your whole body respond with ease.",
  "Let your hands rest over your heart and feel the quiet inside you.",
  "Sit tall and feel the strength in your spine.",
  "Let your breath move gently through your chest and soften the space there.",
  "Place your hand on your lower ribs and feel them expand with your breath.",
  "Let your fingers rest lightly on your throat and feel the subtle movement.",
  "Sit still and feel your breath warm the inside of your body.",
  "Let your shoulders soften and feel the release ripple downward.",
  "Place your hand on your upper arm and feel the comfort of your own touch.",
  "Take a slow inhale and feel your body wake up from the inside.",
  "Let your breath deepen and feel a quiet spark rise within you.",
];

/* -----------------------------------------------------
   🌸 BLOOM VIDEOS — 22 total
----------------------------------------------------- */
const BLOOMS = [
  "/bloom-videos/bloom-01.mp4",
  "/bloom-videos/bloom-02.mp4",
  "/bloom-videos/bloom-03.mp4",
  "/bloom-videos/bloom-04.mp4",
  "/bloom-videos/bloom-05.mp4",
  "/bloom-videos/bloom-06.mp4",
  "/bloom-videos/bloom-07.mp4",
  "/bloom-videos/bloom-08.mp4",
  "/bloom-videos/bloom-09.mp4",
  "/bloom-videos/bloom-10.mp4",
  "/bloom-videos/bloom-11.mp4",
  "/bloom-videos/bloom-12.mp4",
  "/bloom-videos/bloom-13.mp4",
  "/bloom-videos/bloom-14.mp4",
  "/bloom-videos/bloom-15.mp4",
  "/bloom-videos/bloom-16.mp4",
  "/bloom-videos/bloom-17.mp4",
  "/bloom-videos/bloom-18.mp4",
  "/bloom-videos/bloom-19.mp4",
  "/bloom-videos/bloom-20.mp4",
  "/bloom-videos/bloom-21.mp4",
  "/bloom-videos/bloom-22.mp4",
];

/* -----------------------------------------------------
   🌙 NEW: PERFECT SEQUENTIAL ROTATION (NO REPEATS)
----------------------------------------------------- */
function getNextSequentialIndex(total, storageKey) {
  const raw = localStorage.getItem(storageKey);
  const index = raw ? parseInt(raw) : 0;

  const next = (index + 1) % total;

  localStorage.setItem(storageKey, next.toString());
  return index;
}

export default function BloomRitualPage() {
  const [gestureIndex, setGestureIndex] = useState(null);
  const [bloomIndex, setBloomIndex] = useState(null);

  const [mode, setMode] = useState("loading");
  const [videoEnded, setVideoEnded] = useState(false);

  /* -----------------------------------------------------
     🌙 DAILY LOCKOUT — SAME DAY → SANCTUARY
----------------------------------------------------- */
  useEffect(() => {
    const last = localStorage.getItem("lastBloomDate");
    const today = new Date().toDateString();

    if (last === today) {
      const savedBloom = localStorage.getItem("todayBloomIndex");
      if (savedBloom !== null) {
        setBloomIndex(parseInt(savedBloom));
        setMode("sanctuary");
        return;
      }
    }

    // NEW DAY → rotate independently
    const g = getNextSequentialIndex(GESTURES.length, "gestureIndex");
    const b = getNextSequentialIndex(BLOOMS.length, "bloomIndex");

    setGestureIndex(g);
    setBloomIndex(b);

    setMode("intro");
  }, []);

  const gesture = gestureIndex !== null ? GESTURES[gestureIndex] : "";
  const bloomSrc = bloomIndex !== null ? BLOOMS[bloomIndex] : "";

  /* -----------------------------------------------------
     🌸 DEV SHORTCUTS — PRESERVED
----------------------------------------------------- */
  useEffect(() => {
    const handler = (e) => {
      if (!e.shiftKey) return;

      if (e.key.toLowerCase() === "f") {
        let current = parseInt(localStorage.getItem("bloomIndex") || "0");
        current = (current + 1) % BLOOMS.length;
        localStorage.setItem("bloomIndex", current.toString());
        localStorage.removeItem("lastBloomDate");
        alert(`🌸 Dev Bloom Test → Bloom #${current}`);
        window.location.reload();
        return;
      }

      if (e.key.toLowerCase() === "g") {
        let current = parseInt(localStorage.getItem("gestureIndex") || "0");
        current = (current + 1) % GESTURES.length;
        localStorage.setItem("gestureIndex", current.toString());
        localStorage.removeItem("lastBloomDate");
        alert(`🌿 Dev Gesture Test → Gesture #${current}`);
        window.location.reload();
        return;
      }

      if (e.key.toLowerCase() === "r") {
        localStorage.removeItem("todayBloomIndex");
        localStorage.removeItem("lastBloomDate");
        localStorage.removeItem("gestureIndex");
        localStorage.removeItem("bloomIndex");
        alert("🔄 Full Reset → Bloom #1");
        window.location.reload();
        return;
      }

      if (e.key === "1") {
        localStorage.setItem("bloomIndex", "0");
        localStorage.removeItem("lastBloomDate");
        alert("🌸 Jumped to Bloom #1");
        window.location.reload();
        return;
      }

      if (e.key === "2") {
        localStorage.setItem("bloomIndex", "1");
        localStorage.removeItem("lastBloomDate");
        alert("🌸 Jumped to Bloom #2");
        window.location.reload();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* -----------------------------------------------------
     🌸 RENDER — YOUR CINEMATIC FLOW (UNCHANGED)
----------------------------------------------------- */

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
      <Navigation />

      {/* INTRO MODE */}
      {mode === "intro" && (
        <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bloom-hero-flowers.jpg')" }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40"></div>

          <div className="relative z-10 w-full max-w-3xl px-6 md:px-10 lg:px-16 pt-32 md:pt-40 pb-10">
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#FFFFFF]">
              Sanctuary • Bloom Ritual • Part 1/3
            </p>

            <h1 className="mt-4 text-4xl md:text-5xl tracking-[0.16em] uppercase text-white/90">
              Your Bloom Ritual
            </h1>

            <p className="mt-6 text-sm md:text-base text-[#FFFFFF] max-w-xl mx-auto leading-relaxed">
              There is a place inside you where the world quiets —  
              where your breath gathers like light on water,  
              where the smallest kindness you offer yourself becomes a tide rising.  
              The Bloom is not a flower on a screen.  
              It is the reflection of your own becoming —  
              a reminder that even the gentlest moment of care can awaken something luminous within you.
            </p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-black/30 px-10 py-12 shadow-[0_0_60px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col items-center gap-8 animate-softRise">
              <p className="uppercase text-[11px] tracking-[0.22em] text-white/40">
                Your Moment of Nourishment
              </p>

              <p className="text-base md:text-lg text-white/75 text-center max-w-xl leading-relaxed">
                {gesture}
              </p>

              <button
                onClick={() => {
                  if (bloomIndex !== null) {
                    localStorage.setItem("todayBloomIndex", bloomIndex.toString());
                    localStorage.setItem("lastBloomDate", new Date().toDateString());
                  }
                  setVideoEnded(false);
                  setMode("bloom");
                }}
                className="mt-4 px-10 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-white/20 text-white/80 hover:border-white/40 hover:text-white transition-all duration-500 backdrop-blur-sm"
              >
                I offered myself a moment
              </button>
            </div>
          </div>
        </section>
      )}

      {/* BLOOM MODE */}
      {mode === "bloom" && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl animate-fadeIn flex flex-col">
          <video
            key={bloomSrc}
            src={bloomSrc}
            autoPlay
            muted
            playsInline
            loop={false}
            onEnded={() => setVideoEnded(true)}
            className="w-full h-full object-cover brightness-[1.25] contrast-[1.1]"
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_70%)] pointer-events-none"></div>

          {videoEnded && (
            <div className="absolute bottom-14 w-full flex flex-col items-center gap-5 animate-softRise">
              <button
                onClick={() => {
                  setVideoEnded(false);
                  const vid = document.querySelector("video");
                  if (vid) {
                    vid.currentTime = 0;
                    vid.play();
                  }
                }}
                className="px-10 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-white/40 text-white/90 hover:bg-white/10 transition-all duration-500"
              >
                Replay
              </button>

              <button
                onClick={() => {
                  localStorage.setItem("todayBloomIndex", bloomIndex.toString());
                  localStorage.setItem("lastBloomDate", new Date().toDateString());
                  setMode("completion");
                }}
                className="px-10 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-white/40 text-white/90 hover:bg-white/10 transition-all duration-500"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}

      {/* COMPLETION MODE */}
      {mode === "completion" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden animate-fadeIn">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bloom-hero-flowers.jpg')" }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40"></div>

          <div className="relative z-10 max-w-lg w-full mx-6 rounded-3xl border border-white/10 bg-black/30 shadow-[0_0_80px_rgba(0,0,0,0.9)] px-10 py-14 flex flex-col items-center gap-8 animate-softRise">
            <h2 className="text-2xl tracking-[0.14em] uppercase text-[#FFFFFF]">
              Ritual Complete
            </h2>

            <p className="text-[#FFFFFF] text-center leading-relaxed max-w-md">
              You offered yourself a moment of nourishment.  
              Something inside you softened, opened, and rose.
            </p>

            <button
              onClick={() => setMode("outro")}
              className="mt-2 px-10 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-white/30 text-[#FFFFFF] hover:bg-white/10 transition-all duration-500"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* OUTRO MODE */}
      {mode === "outro" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden animate-fadeInSlow">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bloom-hero-flowers.jpg')" }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40"></div>

          <div className="relative z-10 text-center px-10 animate-softRiseSlow">
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#FFFFFF] mb-6">
              Sanctuary • Bloom Ritual
            </p>

            <h2 className="text-3xl md:text-4xl tracking-[0.14em] uppercase text-[#FFFFFF] mb-6">
              Your Ritual for Today is Complete
            </h2>

            <p className="text-[#FFFFFF] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Return tomorrow for your next Bloom —  
              a new unfolding, a new breath, a new moment of becoming.
            </p>

            <button
              onClick={() => {
                setVideoEnded(false);
                setMode("sanctuary");
              }}
              className="mt-10 px-10 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-white/30 text-[#FFFFFF] hover:bg-white/10 transition-all duration-500"
            >
              Return to Sanctuary
                      </button>
          </div>
        </div>
      )}

      {/* SANCTUARY MODE */}
      {mode === "sanctuary" && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl animate-fadeIn flex flex-col">
          <video
            key={bloomSrc}
            src={bloomSrc}
            autoPlay
            muted
            playsInline
            loop={false}
            onEnded={() => setVideoEnded(true)}
            className="w-full h-full object-cover brightness-[1.25] contrast-[1.1]"
          />

          {videoEnded && (
            <>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

              <div className="absolute bottom-8 left-10 animate-softRiseSlow">
                <p className="text-[#C6A667] text-sm md:text-base tracking-[0.18em] uppercase drop-shadow-[0_0_8px_rgba(0,0,0,0.7)]">
                  You bloomed today.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes softRise {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInSlow {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes softRiseSlow {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }

        .animate-softRise {
          animation: softRise 1.2s ease forwards;
        }

        .animate-fadeInSlow {
          animation: fadeInSlow 2.2s ease forwards;
        }

        .animate-softRiseSlow {
          animation: softRiseSlow 2.4s ease forwards;
        }
      `}</style>
    </div>
  );
}
