"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";

import { GESTURES } from "@/data/gestures";
import { BLOOMS } from "@/data/blooms";

import {
  getBloomProgress,
  completeTodayBloom,
} from "@/lib/bloom";

import {
  getGestureProgress,
  completeGesture,
} from "@/lib/gesture";

type RitualState =
  | "INIT"
  | "GESTURE"
  | "BLOOM_READY"
  | "BLOOM_PLAYING"
  | "BLOOM_DONE"
  | "LOCKED";

export default function BloomRitualPage() {
  return <BloomContent />;
}

function BloomContent() {
  const [state, setState] = useState<RitualState>("INIT");

  const [gestureIndex, setGestureIndex] = useState<number>(0);
  const [bloomIndex, setBloomIndex] = useState<number>(0);

  const [hasBloomedToday, setHasBloomedToday] = useState(false);
  const [justBloomedNow, setJustBloomedNow] = useState(false);

  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const [videoEnded, setVideoEnded] = useState(false);

  // ⭐ Minimal fix — no auth gating here
  useEffect(() => {
    const init = async () => {
      const [bloom, gesture] = await Promise.all([
  getBloomProgress(),
  getGestureProgress()
]);


      if (!bloom || !gesture) {
        setGestureIndex(0);
        setBloomIndex(0);
        setVideoSrc(BLOOMS[0]);
        setState("GESTURE");
        return;
      }

      const localLastCompleted = bloom.last_completed_local;
      const localProfileDate = bloom.profile_last_bloom_date ?? null;

      const alreadyBloomed =
        localLastCompleted === localProfileDate &&
        localLastCompleted !== null &&
        localProfileDate !== null;

      const bloomIdx = bloom.current_day - 1;
      setBloomIndex(bloomIdx);

      setGestureIndex(gesture.current_index);

      if (alreadyBloomed) {
        setHasBloomedToday(true);
        setVideoSrc(bloom.profile_last_bloom_video || BLOOMS[bloomIdx]);
        setState("LOCKED");
      } else {
        setHasBloomedToday(false);
        setVideoSrc(BLOOMS[bloomIdx]);
        setState("GESTURE");
      }
    };

    init();
  }, []);

  const handleGestureComplete = async () => {
    const gesture = await getGestureProgress();
    if (!gesture) {
      setState("BLOOM_READY");
      return;
    }

    if (hasBloomedToday) {
      setState("LOCKED");
      return;
    }

    await completeGesture(gesture);

    setGestureIndex((prev) => {
      const next = prev + 1 >= GESTURES.length ? 0 : prev + 1;
      return next;
    });

    setState("BLOOM_READY");
  };

  const handleBloomStart = async () => {
    if (!hasBloomedToday) {
      const bloom = await getBloomProgress();
      if (bloom) {
        await completeTodayBloom(bloom, videoSrc!);
        setHasBloomedToday(true);
        setJustBloomedNow(true);
      }
    }

    setState("BLOOM_PLAYING");
  };

  const handleBloomEnd = () => {
    setVideoEnded(true);
    setState("BLOOM_DONE");
  };

  const gestureText = GESTURES[gestureIndex];

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

      {["BLOOM_READY", "BLOOM_PLAYING", "BLOOM_DONE", "LOCKED"].includes(
        state
      ) && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl animate-fadeIn flex flex-col">
          <video
            key={videoSrc}
            src={videoSrc || ""}
            autoPlay
            muted
            playsInline
            loop={false}
            onPlay={handleBloomStart}
            onEnded={handleBloomEnd}
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
