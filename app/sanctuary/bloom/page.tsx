"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { supabase } from "@/lib/supabase/client";

import { GESTURES } from "@/data/gestures";
import { BLOOMS } from "@/data/blooms";

export default function BloomRitualPage() {
  return <BloomContent />;
}

function BloomContent() {
  const [gestureIndex, setGestureIndex] = useState<number | null>(null);
  const [bloomIndex, setBloomIndex] = useState<number | null>(null);

  const [mode, setMode] = useState<"loading" | "gesture" | "bloom">("loading");
  const [videoEnded, setVideoEnded] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [hasBloomedToday, setHasBloomedToday] = useState(false);
  const [justBloomedNow, setJustBloomedNow] = useState(false);

  /* -----------------------------------------------------
     🌿 INIT — Load Bloom + Gesture Progress (FIXED)
  ----------------------------------------------------- */
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setGestureIndex(0);
        setBloomIndex(0);
        setMode("gesture");
        return;
      }

      setUserId(user.id);

      // Bloom progress
      const { data: bloomData } = await supabase
        .from("bloom_progress")
        .select("current_day, last_completed")
        .eq("user_id", user.id)
        .single();

      // Gesture progress
      const { data: gestureData } = await supabase
        .from("gesture_progress")
        .select("current_index, last_index, last_completed")
        .eq("user_id", user.id)
        .single();

      // Timezone-correct today
      const { data: todayData } = await supabase.rpc("get_user_today", {
        user_id: user.id,
      });

      const today = todayData?.today;
      const now = todayData?.now;

      // Fetch profile bloom fields
      const { data: profileBloom } = await supabase
        .from("profiles")
        .select("last_bloom_date")
        .eq("id", user.id)
        .single();

      let bloomIdx = 0;

      if (bloomData) {
        bloomIdx = bloomData.current_day - 1;
      } else {
        await supabase.from("bloom_progress").insert({
          user_id: user.id,
          current_day: 1,
          completed_all: false,
          last_completed: null,
        });
      }

      let gestureIdx = 0;

      if (gestureData) {
        gestureIdx = gestureData.current_index ?? 0;
      } else {
        await supabase.from("gesture_progress").insert({
          user_id: user.id,
          current_index: 0,
          last_index: -1,
          last_completed: null,
        });
      }

      // ⭐ FIXED BLOOM LOCK LOGIC — compare timestamps, not strings
      const bloomLocked =
        (bloomData?.last_completed &&
          bloomData.last_completed.slice(0, 10) === today) ||
        (profileBloom?.last_bloom_date &&
          profileBloom.last_bloom_date.slice(0, 10) === today);

      if (!isMounted) return;

      setGestureIndex(gestureIdx);
      setBloomIndex(bloomIdx);
      setHasBloomedToday(bloomLocked);
      setMode(bloomLocked ? "bloom" : "gesture");
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  /* -----------------------------------------------------
     🌿 COMPLETE GESTURE → Save progress + go to Bloom
  ----------------------------------------------------- */
  const handleGestureComplete = async () => {
    if (!userId || bloomIndex === null || gestureIndex === null) {
      setMode("bloom");
      return;
    }

    if (hasBloomedToday) {
      setJustBloomedNow(false);
      setMode("bloom");
      return;
    }

    const { data: todayData } = await supabase.rpc("get_user_today", {
      user_id: userId,
    });

    const today = todayData?.today;
    const now = todayData?.now;

    // Advance Bloom
    let nextBloom = bloomIndex + 1;
    if (nextBloom >= BLOOMS.length) nextBloom = 0;

    await supabase
      .from("bloom_progress")
      .update({
        current_day: nextBloom + 1,
        last_completed: now, // ⭐ FIXED
        updated_at: now,
      })
      .eq("user_id", userId);

    // Advance Gesture
    let nextGesture = gestureIndex + 1;
    if (nextGesture >= GESTURES.length) nextGesture = 0;

    await supabase
      .from("gesture_progress")
      .update({
        current_index: nextGesture,
        last_index: gestureIndex,
        last_completed: now, // ⭐ FIXED
        updated_at: now,
      })
      .eq("user_id", userId);

    setBloomIndex(nextBloom);
    setHasBloomedToday(true);
    setJustBloomedNow(true);
    setMode("bloom");
  };

  /* -----------------------------------------------------
     🌿 COMPLETE BLOOM RITUAL → Update profile + bloom_progress
  ----------------------------------------------------- */
  const handleBloomComplete = async () => {
    if (!userId || bloomIndex === null) return;

    const { data: todayData } = await supabase.rpc("get_user_today", {
      user_id: userId,
    });

    const today = todayData?.today;
    const now = todayData?.now;

    // Update profile bloom fields
    await supabase
      .from("profiles")
      .update({
        last_bloom_date: now, // ⭐ FIXED
        last_bloom_video: BLOOMS[bloomIndex],
        bloom_cycle: bloomIndex + 1,
        updated_at: now,
      })
      .eq("id", userId);

    // Ensure bloom_progress also reflects today's bloom
    await supabase
      .from("bloom_progress")
      .update({
        last_completed: now, // ⭐ FIXED
        updated_at: now,
      })
      .eq("user_id", userId);

    setHasBloomedToday(true);
  };

  const gesture = gestureIndex !== null ? GESTURES[gestureIndex] : "";
  const bloomSrc = bloomIndex !== null ? BLOOMS[bloomIndex] : "";

  /* -----------------------------------------------------
     🌿 RENDER
  ----------------------------------------------------- */
  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
      <Navigation />

      {/* GESTURE PAGE */}
      {mode === "gesture" && (
        <section className="relative min-h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bloom-hero-flowers.jpg')" }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40"></div>

          <div className="relative z-10 w-full max-w-3xl px-6 md:px-10 lg:px-16 pt-32 md:pt-40 pb-10">
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#FFFFFF]">
              Sanctuary • Bloom Ritual
            </p>

            <h1 className="mt-4 text-4xl md:text-5xl tracking-[0.16em] uppercase text-white/90">
              Your Bloom Ritual
            </h1>

            <p className="mt-6 text-sm md:text-base text-[#FFFFFF] max-w-xl mx-auto leading-relaxed">
              {gesture}
            </p>

            <button
              onClick={handleGestureComplete}
              className="mt-6 px-10 py-3 rounded-full text-[11px] tracking-[0.22em] uppercase border border-white/20 text-white/80 hover:border-white/40 hover:text-white transition-all duration-500 backdrop-blur-sm"
            >
              I offered myself a moment
            </button>
          </div>
        </section>
      )}

      {/* BLOOM PAGE */}
      {mode === "bloom" && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl animate-fadeIn flex flex-col">
          <video
            key={bloomSrc}
            src={bloomSrc}
            autoPlay
            muted
            playsInline
            loop={false}
            onEnded={() => {
              setVideoEnded(true);
              if (justBloomedNow) handleBloomComplete();
            }}
            className="w-full h-full object-cover brightness-[1.25] contrast-[1.1]"
          />

          {videoEnded && justBloomedNow && (
            <div className="absolute bottom-10 left-10 animate-softRiseSlow">
              <p className="text-golden-400 text-base tracking-[0.18em] uppercase drop-shadow-[0_0_8px_rgba(0,0,0,0.7)]">
                You bloomed today.
              </p>
            </div>
          )}

          {videoEnded && !justBloomedNow && (
            <div className="absolute bottom-10 left-10 animate-softRiseSlow">
              <p className="text-golden-400 text-base tracking-[0.18em] uppercase drop-shadow-[0_0_8px_rgba(0,0,0,0.7)]">
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
