"use client";

import { useEffect, useState, useRef } from "react";
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
  const [state, setState] = useState<RitualState>("INIT");

  const [gestureIndex, setGestureIndex] = useState(0);
  const [bloomIndex, setBloomIndex] = useState(0);

  const [hasBloomedToday, setHasBloomedToday] = useState(false);
  const [justBloomedNow, setJustBloomedNow] = useState(false);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !bloom || !gesture) return;

    const todayLocal = bloom.today_local ?? null;
    const lastBloomDate = bloom.profile_last_bloom_date ?? null;

    const alreadyBloomed =
      Boolean(lastBloomDate) &&
      Boolean(todayLocal) &&
      lastBloomDate?.slice(0, 10) === todayLocal?.slice(0, 10);

    const rawGestureIdx = gesture.current_index ?? 0;
    const safeGestureIdx = GESTURES.length > 0 ? rawGestureIdx % GESTURES.length : 0;

    const rawBloomIdx = (bloom.current_day ?? 1) - 1;
    const safeBloomIdx = BLOOMS.length > 0 ? Math.max(0, rawBloomIdx % BLOOMS.length) : 0;

    setGestureIndex(safeGestureIdx);
    setBloomIndex(safeBloomIdx);

    const activeVideo = bloom.profile_last_bloom_video || BLOOMS[safeBloomIdx];
    setVideoSrc(activeVideo);

    if (alreadyBloomed) {
      setHasBloomedToday(true);
      setJustBloomedNow(false);
      setState("LOCKED");
    } else {
      setHasBloomedToday(false);
      setJustBloomedNow(false);
      setState("GESTURE");
    }
  }, [ready, bloom, gesture]);

  const handleGestureComplete = async () => {
    if (!ready || !gesture || !userId || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await completeGestureAction(gesture, userId);
      setGestureIndex((prev) => (prev + 1) % GESTURES.length);
      setState("BLOOM_READY");
    } catch (err) {
      console.error("❌ Failed to complete gesture:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBloomStart = async () => {
    if (!ready || !bloom || !videoSrc || !userId) return;

    if (!hasBloomedToday && !justBloomedNow && !isSubmitting) {
      try {
        setIsSubmitting(true);
        await completeTodayBloomAction(bloom, videoSrc, userId);
        setHasBloomedToday(true);
        setJustBloomedNow(true);
        onRefresh().catch(console.error);
      } catch (err) {
        console.error("❌ Failed to register bloom completion:", err);
      } finally {
        setIsSubmitting(false);
      }
    }

    setState("BLOOM_PLAYING");
  };

  const handleBloomEnd = () => {
    setState("BLOOM_DONE");
  };

  const gestureText = GESTURES[gestureIndex] || "Take a deep breath and offer yourself a moment.";

  if (!ready || !bloom || !gesture || !videoSrc) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 tracking-[3px] uppercase animate-pulse">
          Loading Ritual…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
      <Navigation />

      {state === "GESTURE" && (
        <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bloom-hero-flowers.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />

          <div className="relative z-10 w-full max-w-3xl px-6 md:px-10 lg:px-16 pt-32 md:pt-40 pb-10">
            <p className="text-[11px] tracking-[0.28em] uppercase text-white/80">
              Sanctuary • Bloom Ritual
            </p>

            <h1 className="mt-4 text-4xl md:text-5xl tracking-[0.16em] uppercase text-white/90">
              Your Bloom Ritual
            </h1>

            <p className="mt-6 text-sm md:text-base text-white max-w-xl mx-auto leading-relaxed">
              {gestureText}
            </p>

            <button
              onClick={handleGestureComplete}
              disabled={isSubmitting}
              className="mt-6 px-10 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-white/20 hover:border-white/40 transition-all duration-500 backdrop-blur-sm disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "I offered myself a moment"}
            </button>
          </div>
        </section>
      )}

      {["BLOOM_READY", "BLOOM_PLAYING", "BLOOM_DONE", "LOCKED"].includes(state) && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl animate-fadeIn flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            key={videoSrc ?? "bloom-video"}
            src={videoSrc || ""}
            autoPlay
            playsInline
            controls={state === "BLOOM_PLAYING" || state === "LOCKED"}
            onPlay={handleBloomStart}
            onEnded={handleBloomEnd}
            className="w-full h-full object-cover brightness-[1.25] contrast-[1.1]"
          />

          {state === "BLOOM_READY" && (
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(console.error);
                }
              }}
              className="absolute z-50 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white tracking-[0.2em] uppercase text-xs backdrop-blur-md transition-all"
            >
              Begin Video
            </button>
          )}

          {state === "BLOOM_DONE" && justBloomedNow && (
            <div className="absolute bottom-10 left-10 animate-softRiseSlow pointer-events-none">
              <p className="text-amber-300 text-base tracking-[0.18em] uppercase">
                You bloomed today.
              </p>
            </div>
          )}

          {(state === "LOCKED" || (state === "BLOOM_DONE" && !justBloomedNow)) && (
            <div className="absolute bottom-10 left-10 animate-softRiseSlow pointer-events-none">
              <p className="text-amber-300 text-base tracking-[0.18em] uppercase">
                Come back tomorrow.
              </p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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