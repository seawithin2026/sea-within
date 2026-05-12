"use client";

import { useState, useEffect, type FormEvent } from "react";
import Navigation from "@/components/layout/Navigation";

interface WisdomPost {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

export default function WisdomBoardPage() {
  const [posts, setPosts] = useState<WisdomPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const dailyMessage = {
    text: "You are more held by life than you realize.",
    attribution: "Anonymous — Japan — May 10, 2026",
  };

  useEffect(() => {
    const bottle = document.getElementById("bottleVideo") as HTMLVideoElement | null;
    if (bottle) bottle.playbackRate = 0.5;
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/messages?type=wisdom");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      console.error("Failed to fetch posts");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsSubmitting(true);
    setFeedback("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost, type: "wisdom" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedbackType("error");
        setFeedback(
          data.suggestion ||
            "This space welcomes honesty, depth, and vulnerability. Only harmful or attacking language is not allowed."
        );
        return;
      }

      setFeedbackType("success");
      setFeedback("Your reflection has been shared with the community.");
      setNewPost("");
      fetchPosts();
    } catch {
      setFeedbackType("error");
      setFeedback("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-sanctuary-dark">
      <Navigation />

      {/* SECTION 1 */}
      <section className="relative h-[150vh] w-full bg-black flex items-center justify-center overflow-hidden">
        <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src="/videos/ocean-hero.mp4" type="video/mp4" />
        </video>
      </section>

      {/* SECTION 2 — BOTTLE (LOWERED MEDIUM) */}
      <section className="relative h-[165vh] w-full bg-black flex items-center justify-center overflow-hidden">
        <video
          id="bottleVideo"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 70%" }} // medium lower to reveal more bottle
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/ocean-bottle.mp4" type="video/mp4" />
        </video>
      </section>

      {/* SECTION 3 — REVEALED PAGE WITH ENGRAVED INK */}
      <section className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">
        <img
          src="/images/paper-texture.png"
          alt="Paper"
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-10 py-32 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-stone-600/70 mb-8">
            Today&apos;s Message
          </p>

          <p className="paper-reveal text-3xl leading-relaxed mb-10">
            {dailyMessage?.text}
          </p>

          <p className="paper-reveal text-base opacity-80">
            {dailyMessage?.attribution}
          </p>
        </div>
      </section>

      {/* SECTION 4 — SPLIT SCREEN: VIDEO LEFT, PARCHMENT INVITATION + WRITING RIGHT */}
      <section className="relative min-h-screen w-full bg-black flex items-center justify-center px-6 py-24">
        <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          {/* LEFT: PURE VIDEO */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.7)] border border-stone-800">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/ocean-wisdom.mp4" type="video/mp4" />
            </video>
          </div>

          {/* RIGHT: SECTION-3-STYLE PARCHMENT WITH INVITATION + TEXTAREA */}
          <div className="relative rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-stone-300 bg-[#f0e6d2]">
            <img
              src="/images/paper-texture.png"
              alt="Paper"
              className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
            />

            <div className="relative z-10 max-w-xl mx-auto px-8 md:px-10 py-10 md:py-12 text-center">
              <p className="paper-reveal text-3xl leading-relaxed mb-10">
                Send good vibes and light to the community.
              </p>

              <form onSubmit={handleSubmit} className="mt-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Write your message as if you were writing inside a sacred book…"
                  className="w-full h-64 bg-transparent resize-none focus:outline-none text-xl leading-relaxed ink-writing placeholder:text-stone-500"
                />

                <button
                  type="submit"
                  disabled={isSubmitting || !newPost.trim()}
                  className="mt-6 px-8 py-3 bg-amber-600/80 hover:bg-amber-500 text-white rounded-full transition-all disabled:opacity-40"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>

              {feedback && (
                <p
                  className={`mt-4 text-sm ${
                    feedbackType === "error" ? "text-red-400" : "text-amber-600"
                  }`}
                >
                  {feedback}
                </p>
              )}

              <p className="mt-4 text-xs text-stone-700/85">
                Your message will be shared anonymously with the community, along with your
                country and today&apos;s date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL MERGED STYLES */}
      <style jsx global>{`
        /* SECTION 3 — ENGRAVED PAPER REVEAL */
        .paper-reveal {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          color: #4a2e1a; /* warm brown ink */
          opacity: 0;
          animation: paperFade 3.5s ease forwards;
          text-shadow:
            0 1px 0 rgba(0, 0, 0, 0.12),
            0 2px 1px rgba(0, 0, 0, 0.1),
            0 0 8px rgba(0, 0, 0, 0.08);
          filter: brightness(0.9) contrast(1.12) saturate(0.85);
        }

        @keyframes paperFade {
          0% {
            opacity: 0;
            transform: translateY(6px);
            filter: blur(3px) brightness(0.85);
          }
          40% {
            opacity: 0.45;
            transform: translateY(2px);
            filter: blur(1.5px) brightness(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0.4px) brightness(1);
          }
        }

        /* SECTION 4 — ENHANCED INK WRITING */
        .ink-writing {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          color: #3b2414;
          opacity: 0;
          animation: inkReveal 3.2s ease forwards;
          letter-spacing: 0.3px;
          text-shadow:
            0 0 1px rgba(30, 18, 10, 0.5),
            0 1px 2px rgba(30, 18, 10, 0.35),
            0 2px 4px rgba(30, 18, 10, 0.25),
            0 0 12px rgba(30, 18, 10, 0.15);
          filter: brightness(0.92) contrast(1.08) saturate(0.9);
        }

        @keyframes inkReveal {
          0% {
            opacity: 0;
            filter: blur(4px) brightness(0.8);
            transform: translateY(6px);
          }
          35% {
            opacity: 0.4;
            filter: blur(2px) brightness(0.9);
            transform: translateY(3px);
          }
          70% {
            opacity: 0.85;
            filter: blur(1px) brightness(1);
          }
          100% {
            opacity: 1;
            filter: blur(0.3px) brightness(1.05);
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
