"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

type WisdomPost = {
  id: string;
  content: string;
};

type DriftLotus = {
  id: string;
  content: string;
  delay: number;
  duration: number;
  startX: number;
  endX: number;
  startY: number;
  endY: number;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RevealBoard() {
  const [posts, setPosts] = useState<WisdomPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<WisdomPost | null>(null);

  // Load approved wisdom posts
  useEffect(() => {
    const loadPosts = async () => {
      const { data, error } = await supabase
        .from("wisdom_posts")
        .select("id, content")
        .eq("is_approved", true)
        .order("id", { ascending: true });

      if (data) setPosts(data as WisdomPost[]);
      else console.error("Error loading posts:", error);
    };

    loadPosts();
  }, []);

  // Generate drifting lotus paths (cinematic floating)
  const driftingLotuses: DriftLotus[] = useMemo(() => {
    if (!posts.length) return [];

    return posts.map((p, index) => {
      const delay = index * 8;

      // MUCH slower drift
      const duration = 90 + (index % 5) * 15;

      // Alternate drift direction
      const startFromLeft = index % 2 === 0;

      const startX = startFromLeft ? -10 : 110;
      const endX = startFromLeft ? 110 : -10;

      // Wider vertical band for natural floating
      const bandTop = 25;
      const bandBottom = 75;

      const startY =
        bandTop + ((bandBottom - bandTop) / posts.length) * index +
        (index % 3) * 2;

      // Slight diagonal drift
      const endY = startY + (index % 2 === 0 ? 8 : -8);

      return {
        id: p.id,
        content: p.content,
        delay,
        duration,
        startX,
        endX,
        startY,
        endY,
      };
    });
  }, [posts]);

  // Generate CSS keyframes
  const keyframesCss = useMemo(() => {
    return driftingLotuses
      .map(
        (l, i) => `
        @keyframes lotus-drift-${i} {
          0% {
            transform: translate3d(${l.startX}vw, ${l.startY}vh, 0);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            transform: translate3d(${l.endX}vw, ${l.endY}vh, 0);
            opacity: 0;
          }
        }
      `
      )
      .join("\n");
  }, [driftingLotuses]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-amber-50">

      {/* Inject drifting animations */}
      <style>{keyframesCss}</style>

      {/* Background video */}
      <div className="absolute inset-0 -z-20">
        <video
          src="/videos/ocean-night.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* LIGHTER overlay so video is visible */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Drifting lotuses */}
      <section className="pointer-events-none relative z-10 h-screen w-full">
        {driftingLotuses.map((l, index) => (
          <button
            key={l.id}
            type="button"
            className="absolute pointer-events-auto"
            style={{
              animation: `lotus-drift-${index} ${l.duration}s linear ${l.delay}s infinite`,
            }}
            onClick={() => setSelectedPost({ id: l.id, content: l.content })}
          >
            <div className="relative h-32 w-32">
              <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-2xl" />
              <Image
                src="/lotus/lotus-amber.png"
                alt="Lotus Lantern"
                fill
                className="object-contain drop-shadow-[0_0_35px_rgba(251,191,36,0.9)]"
              />
            </div>
          </button>
        ))}
      </section>

      {/* Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-md w-[90%] rounded-2xl border border-amber-200/30 bg-black/80 px-6 py-5 text-amber-50">
            <button
              className="absolute right-4 top-3 text-xs uppercase tracking-[0.2em] text-amber-200/70 hover:text-amber-100"
              onClick={() => setSelectedPost(null)}
            >
              Close
            </button>
            <p className="text-[11px] tracking-[0.3em] uppercase text-amber-200/70 mb-3">
              Shared Wisdom
            </p>
            <p className="text-sm leading-relaxed text-amber-50/95 whitespace-pre-line">
              {selectedPost.content}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
