"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { supabase } from "@/lib/supabase/client";

import { GESTURES } from "@/data/gestures";
import { BLOOMS } from "@/data/blooms";


/* -----------------------------------------------------
   🌿 Sequential rotation fallback for guests only
----------------------------------------------------- */
function getNextSequentialIndex(total: number, storageKey: string) {
  const raw =
    typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
  const index = raw ? parseInt(raw) : 0;

  const next = (index + 1) % total;

  if (typeof window !== "undefined") {
    localStorage.setItem(storageKey, next.toString());
  }

  return index;
}

export default function BloomRitualPage() {
  return <BloomContent />;
}


function BloomContent() {

  const [gestureIndex, setGestureIndex] = useState<number | null>(null);
  const [bloomIndex, setBloomIndex] = useState<number | null>(null);

  const [mode, setMode] = useState<
    "loading" | "intro" | "bloom" | "completion" | "outro" | "sanctuary"
  >("loading");

  const [videoEnded, setVideoEnded] = useState(false);
 
  const [userId, setUserId] = useState<string | null>(null);

  /* -----------------------------------------------------
     🌸 INIT — Bloom + Gesture (Supabase)
----------------------------------------------------- */
  useEffect(() => {
    let isMounted = true;

    const init = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      /* -----------------------------------------------------
         🌿 Guest users → fallback rotation
      ----------------------------------------------------- */
      if (!user) {
        const g = getNextSequentialIndex(GESTURES.length, "gestureIndex");
        const b = getNextSequentialIndex(BLOOMS.length, "bloomIndex");

        if (!isMounted) return;

        setGestureIndex(g);
        setBloomIndex(b);
        setMode("intro");
        return;
      }

      /* -----------------------------------------------------
         🌿 Authenticated user
      ----------------------------------------------------- */
      setUserId(user.id);

      /* -----------------------------------------------------
         🌸 BLOOM PROGRESS FETCH
      ----------------------------------------------------- */
      const { data: bloomProgress } = await supabase
        .from("bloom_progress")
        .select("current_index, last_index")
        .eq("user_id", user.id)
        .single();

      let bloomIdx = 0;

      if (bloomProgress) {
        bloomIdx = bloomProgress.current_index ?? 0;

        // Non-repeat rule
        if (bloomProgress.last_index === bloomIdx) {
          bloomIdx = (bloomIdx + 1) % BLOOMS.length;
        }
      }

      /* -----------------------------------------------------
         🌿 GESTURE PROGRESS FETCH
      ----------------------------------------------------- */
      const { data: gestureProgress } = await supabase
        .from("gesture_progress")
        .select("current_index, last_index")
        .eq("user_id", user.id)
        .single();

      let gestureIdx = 0;

      if (gestureProgress) {
        gestureIdx = gestureProgress.current_index ?? 0;

        // Non-repeat rule
        if (gestureProgress.last_index === gestureIdx) {
          gestureIdx = (gestureIdx + 1) % GESTURES.length;
        }
      } else {
        // First-time user → initialize gesture progress
        await supabase.from("gesture_progress").insert({
          user_id: user.id,
          current_index: 0,
          last_index: null,
          last_completed: null,
        });
      }

      if (!isMounted) return;

      setGestureIndex(gestureIdx);
      setBloomIndex(bloomIdx);
      setMode("intro");
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  /* -----------------------------------------------------
     🌸 Completion → advance bloom + gesture
----------------------------------------------------- */
  const handleBloomComplete = async () => {
    if (!userId || bloomIndex === null || gestureIndex === null) {
      setMode("completion");
      return;
    }

    const now = new Date().toISOString();

    /* -----------------------------------------------------
       🌸 Advance Bloom
    ----------------------------------------------------- */
    let nextBloom = bloomIndex + 1;
    if (nextBloom >= BLOOMS.length) nextBloom = 0;

    await supabase.from("bloom_progress").upsert({
      user_id: userId,
      current_index: nextBloom,
      last_index: bloomIndex,
      last_completed: now,
    });

    /* -----------------------------------------------------
       🌿 Advance Gesture
    ----------------------------------------------------- */
    let nextGesture = gestureIndex + 1;
    if (nextGesture >= GESTURES.length) nextGesture = 0;

    await supabase.from("gesture_progress").upsert({
      user_id: userId,
      current_index: nextGesture,
      last_index: gestureIndex,
      last_completed: now,
    });

    setMode("completion");
  };

  /* -----------------------------------------------------
     🌸 Intro → Bloom transition
----------------------------------------------------- */
  const handleIntroContinue = () => {
    setVideoEnded(false);
    setMode("bloom");
  };

  const gesture = gestureIndex !== null ? GESTURES[gestureIndex] : "";
  const bloomSrc = bloomIndex !== null ? BLOOMS[bloomIndex] : "";

  /* -----------------------------------------------------
     🌸 RENDER — CINEMATIC FLOW
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
                onClick={handleIntroContinue}
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
                    (vid as HTMLVideoElement).currentTime = 0;
                    (vid as HTMLVideoElement).play();
                  }
                }}
                className="px-10 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-white/40 text-white/90 hover:bg-white/10 transition-all duration-500"
              >
                Replay
              </button>

              <button
                onClick={handleBloomComplete}
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
              className="mt-2 px-10 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-[#FFFFFF] text-[#FFFFFF] hover:bg-white/10 transition-all duration-500"
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
              className="mt-10 px-10 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-[#FFFFFF] text-[#FFFFFF] hover:bg-white/10 transition-all duration-500"
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
                <p className="text-golden-400 text-m md:text-base tracking-[0.18em] uppercase drop-shadow-[0_0_8px_rgba(0,0,0,0.7)]">
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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes softRise {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInSlow {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes softRiseSlow {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
