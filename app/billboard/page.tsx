// app/billboard/page.tsx
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BillboardPage() {
  const [posts, setPosts] = useState<WisdomPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<WisdomPost | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      const { data, error } = await supabase
        .from("wisdom_posts")
        .select("id, content")
        .eq("is_approved", true)
        .order("id", { ascending: true });

      if (!error && data) {
        setPosts(data as WisdomPost[]);
      } else {
        console.error("Error loading wisdom_posts:", error);
      }
    };

    loadPosts();
  }, []);

  const driftingLotuses: DriftLotus[] = useMemo(() => {
    if (!posts.length) return [];

    return posts.map((p, index) => {
      const baseDelay = index * 6; // staggered start
      const duration = 40 + (index % 5) * 5; // 40–60s
      const startFromLeft = index % 2 === 0;

      const startX = startFromLeft ? -15 : 115;
      const endX = startFromLeft ? 115 : -15;

      const bandTop = 55;
      const bandBottom = 80;
      const startY =
        bandTop + ((bandBottom - bandTop) / posts.length) * index +
        (index % 3) * 2;
      const endY = startY - 10 + (index % 4) * 3;

      return {
        id: p.id,
        content: p.content,
        delay: baseDelay,
        duration,
        startX,
        endX,
        startY,
        endY,
      };
    });
  }, [posts]);

  const keyframesCss = useMemo(() => {
    return driftingLotuses
      .map(
        (l, i) => `
      @keyframes lotus-drift-${i} {
        0% {
          transform: translate3d(${l.startX}vw, ${l.startY}vh, 0);
          opacity: 0;
        }
        8% {
          opacity: 1;
        }
        92% {
          opacity: 1;
        }
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
      {/* Global keyframes for drifting lotuses */}
      <style jsx global>{keyframesCss}</style>

      {/* Background: cinematic ocean + golden sanctuary moon */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <Image
          src="/images/cinematic-ocean-sanctuary-moon.jpg"
          alt="Cinematic dark ocean with golden-orange sanctuary moon and lotus"
          fill
          priority
          className="object-cover"
        />
        {/* Vignette + depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/85" />
        {/* Subtle horizon glow */}
        <div className="absolute inset-x-0 top-1/3 h-40 bg-gradient-to-b from-amber-100/10 via-transparent to-transparent blur-3xl opacity-80" />
      </div>

      {/* Very subtle parallax overlay for movement */}
      <div className="pointer-events-none absolute inset-0 -z-10 animate-[slow-parallax_60s_linear_infinite_alternate] opacity-60">
        <Image
          src="/images/cinematic-ocean-sanctuary-moon.jpg"
          alt=""
          fill
          className="object-cover scale-105"
        />
      </div>

      <style jsx global>{`
        @keyframes slow-parallax {
          0% {
            transform: translate3d(0, 0, 0) scale(1.05);
          }
          100% {
            transform: translate3d(-1.5rem, -1rem, 0) scale(1.08);
          }
        }
      `}</style>

      {/* Header / Title */}
      <header className="relative z-10 flex flex-col items-center pt-8 px-6">
        <div className="flex w-full max-w-5xl items-center justify-between text-xs tracking-[0.25em] uppercase text-amber-200/80">
          <span className="text-[11px]">SEA WITHIN</span>
          <nav className="hidden gap-6 md:flex text-[11px] text-amber-100/70">
            <span className="hover:text-amber-100 transition-colors">
              Sanctuary
            </span>
            <span className="hover:text-amber-100 transition-colors">
              Journal
            </span>
            <span className="hover:text-amber-100 transition-colors">
              Wisdom Board
            </span>
            <span className="text-amber-100">Wisdom Board Reveal</span>
            <span className="hover:text-amber-100 transition-colors">
              Community
            </span>
          </nav>
          <button className="rounded-full border border-amber-300/40 px-4 py-1.5 text-[11px] font-medium text-amber-100/90 bg-black/30 backdrop-blur-sm hover:bg-amber-200/10 transition">
            Join
          </button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-amber-200/70">
            Wisdom Board Reveal
          </p>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-amber-50">
            The Lotus Sanctuary
          </h1>
          <p className="mt-3 max-w-xl text-xs md:text-sm text-amber-100/80 mx-auto">
            Where every shared truth becomes a lantern on the water.
          </p>
        </div>
      </header>

      {/* Drifting deep-amber lotuses (no text, just the lotus) */}
      <section className="pointer-events-none relative z-10 mt-10 h-[60vh] w-full">
        {driftingLotuses.map((l, index) => (
          <button
            key={l.id}
            type="button"
            className="absolute pointer-events-auto"
            style={{
              animation: `lotus-drift-${index} ${l.duration}s linear ${l.delay}s infinite`,
            }}
            onClick={() =>
              setSelectedPost({ id: l.id, content: l.content } as WisdomPost)
            }
          >
            <div className="relative h-16 w-16 md:h-20 md:w-20">
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-2xl" />
              {/* Lotus image (deep amber lotus from your cinematic image) */}
              <div className="relative h-full w-full">
                <Image
                  src="/images/deep-amber-lotus.png"
                  alt="Deep amber lotus lantern"
                  fill
                  className="object-contain drop-shadow-[0_0_25px_rgba(251,191,36,0.9)]"
                />
              </div>
            </div>
          </button>
        ))}
      </section>

      {/* Call to action */}
      <footer className="relative z-10 mt-10 mb-16 flex flex-col items-center px-6">
        <button className="rounded-full border border-amber-300/60 bg-black/40 px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-amber-100/90 backdrop-blur-md hover:bg-amber-200/10 transition">
          Write Your Truth in the Sand
        </button>
        <p className="mt-3 text-[11px] text-amber-100/70">
          Your words become lanterns on the water.
        </p>
      </footer>

      {/* Modal for selected wisdom post */}
      {selectedPost && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-md w-[90%] rounded-2xl border border-amber-200/30 bg-black/80 px-6 py-5 text-amber-50 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
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
