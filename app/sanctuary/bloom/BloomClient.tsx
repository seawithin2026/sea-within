"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";

import { GESTURES } from "@/data/gestures";
import { BLOOMS } from "@/data/blooms";

import {
  completeGestureAction,
  completeTodayBloomAction,
} from "./actions";

type RitualState =
  | "INIT"
  | "GESTURE"
  | "BLOOM_READY"
  | "BLOOM_PLAYING"
  | "BLOOM_DONE"
  | "LOCKED";

type BloomProgress = {
  id: string;
  current_day: number;
  last_completed_local: string | null;
  today_local: string | null;
  profile_last_bloom_date: string | null;
  profile_last_bloom_video: string | null;
};

type GestureProgress = {
  current_index: number;
};

export default function BloomClient({
  bloom,
  gesture,
  onRefresh,
  userId,
}: {
  bloom: BloomProgress | null;
  gesture: GestureProgress | null;
  onRefresh: () => Promise<void>;
  userId: string | null;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    console.log("🌸 BloomClient mounted");
    setReady(true);
  }, []);

  const [state, setState] = useState<RitualState>("INIT");

  const [gestureIndex, setGestureIndex] = useState(0);
  const [bloomIndex, setBloomIndex] = useState(0);

  const [hasBloomedToday, setHasBloomedToday] = useState(false);
  const [justBloomedNow, setJustBloomedNow] = useState(false);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  /* -----------------------------------------------------
     INITIALIZATION
  ----------------------------------------------------- */
  useEffect(() => {
    console.log("🔄 INIT useEffect triggered");
    console.log("ready:", ready);
    console.log("bloom:", bloom);
    console.log("gesture:", gesture);

    if (!ready) return;
    if (!bloom || !gesture) return;

    const localLastCompleted = bloom.last_completed_local;
    const todayLocal = bloom.today_local ?? null;

    const alreadyBloomed =
      localLastCompleted === todayLocal &&
      localLastCompleted !== null &&
      todayLocal !== null;

    const newGestureIndex = gesture.current_index ?? 0;
    const newBloomIndex = bloom.current_day - 1;

    console.log("🌼 bloomIndex:", newBloomIndex);
    console.log("🪷 gestureIndex:", newGestureIndex);

    setGestureIndex(newGestureIndex);
    setBloomIndex(newBloomIndex);

    if (alreadyBloomed) {
      console.log("🔒 Bloom already completed today");
      setHasBloomedToday(true);
      setVideoSrc(bloom.profile_last_bloom_video || BLOOMS[newBloomIndex]);
      setState("LOCKED");
    } else {
      console.log("🌱 Bloom NOT completed today");
      setHasBloomedToday(false);
      setVideoSrc(BLOOMS[newBloomIndex]);
      setState("GESTURE");
    }

    console.log("🎬 videoSrc set to:", BLOOMS[newBloomIndex]);
  }, [ready, bloom, gesture]);

  /* -----------------------------------------------------
     GESTURE COMPLETE — FIX APPLIED HERE
  ----------------------------------------------------- */
  const handleGestureComplete = async () => {
    console.log("🙏 Gesture complete clicked");

    if (!ready || !gesture || !userId) {
      console.log("❌ Gesture missing data");
      setState("LOCKED");
      return;
    }

    await completeGestureAction(gesture, userId);
    console.log("✨ Gesture completed on server");

    setGestureIndex((prev) => {
      const next = prev + 1 >= GESTURES.length ? 0 : prev + 1;
      console.log("➡️ Gesture index advanced to:", next);
      return next;
    });

    // ⭐ FIX: show bloom video BEFORE refresh remounts the component
    setState("BLOOM_READY");

    // ⭐ Refresh AFTER video overlay is visible
    await onRefresh();
    console.log("🔄 Gesture refresh complete");
  };

  /* -----------------------------------------------------
     BLOOM START
  ----------------------------------------------------- */
  const handleBloomStart = async () => {
    console.log("▶️ BLOOM VIDEO PLAY DETECTED");
    console.log("videoSrc:", videoSrc);

    if (!ready || !bloom || !videoSrc || !userId) {
      console.log("❌ Missing bloom data");
      return;
    }

    if (!hasBloomedToday) {
      console.log("🌸 Completing bloom on server…");
      await completeTodayBloomAction(bloom, videoSrc, userId);
      setHasBloomedToday(true);
      setJustBloomedNow(true);

      await onRefresh();
      console.log("🔄 Bloom refresh complete");
    }

    setState("BLOOM_PLAYING");
  };

  const handleBloomEnd = () => {
    console.log("🏁 BLOOM VIDEO ENDED");
    setState("BLOOM_DONE");
  };

  const gestureText = GESTURES[gestureIndex];

  /* -----------------------------------------------------
     LOADING SCREEN
  ----------------------------------------------------- */
  if (!ready || !bloom || !gesture || !videoSrc) {
    console.log("⏳ Loading screen active");
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 tracking-[3px] uppercase">
          Loading Ritual…
        </p>
      </div>
    );
  }

  /* -----------------------------------------------------
     MAIN UI
  ----------------------------------------------------- */
  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
      <Navigation />

      {/* GESTURE SECTION */}
      {state === "GESTURE" && (
        <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bloom-hero-flowers.jpg')" }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />

          <div className="relative z-10 w-full max-w-3xl px-6 md:px-10 lg:px-16 pt-32 md:pt-40 pb-10">
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#FFFFFF]">
              Sanctuary • Bloom Ritual
            </p>

            <h1 className="mt-4 text-4xl md:text-5xl tracking-[0.16em] uppercase text-white/90">
              Your Bloom Ritual
            </h1>

            <p className="mt-6 text-sm md:text-base text-[#FFFFFF] max-w-xl mx-auto leading-relaxed">
              {gestureText}
            </p>

            <button
              onClick={handleGestureComplete}
              className="mt-6 px-10 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-white/20 hover:border-white/40 transition-all duration-500 backdrop-blur-sm"
            >
              I offered myself a moment
            </button>
          </div>
        </section>
      )}

      {/* BLOOM VIDEO OVERLAY */}
      {["BLOOM_READY", "BLOOM_PLAYING", "BLOOM_DONE", "LOCKED"].includes(
        state
      ) && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl animate-fadeIn flex flex-col">
          <video
            key={videoSrc ?? "bloom-video"}
            src={videoSrc || ""}
            autoPlay
            muted
            playsInline
            loop={false}
            onPlay={handleBloomStart}
            onEnded={handleBloomEnd}
            onLoadedData={() => console.log("🎥 VIDEO LOADED")}
            onError={(e) => console.log("❌ VIDEO ERROR", e)}
            className="w-full h-full object-cover brightness-[1.25] contrast-[1.1]"
          />

          {state === "BLOOM_DONE" && justBloomedNow && (
            <div className="absolute bottom-10 left-10 animate-softRiseSlow">
              <p className="text-golden-400 text-base tracking-[0.18em] uppercase">
                You bloomed today.
              </p>
            </div>
          )}

          {state === "BLOOM_DONE" && !justBloomedNow && hasBloomedToday && (
            <div className="absolute bottom-10 left-10 animate-softRiseSlow">
              <p className="text-golden-400 text-base tracking-[0.18em] uppercase">
                Come back tomorrow.
              </p>
            </div>
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

        .animate-softRiseSlow {
          animation: softRiseSlow 2.4s ease forwards;
        }
      `}</style>
    </div>
  );
}
