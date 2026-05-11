"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
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

  const section3Ref = useRef<HTMLElement | null>(null);
  const section4Ref = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (!section3Ref.current || !section4Ref.current) return;

      const rect3 = section3Ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When Section 3 is mostly above the viewport, fade it out and fade Section 4 in
      if (rect3.bottom < windowHeight * 0.5) {
        section3Ref.current.classList.add("scrolled-out");
        section4Ref.current.classList.add("scrolled-in");
      } else {
        section3Ref.current.classList.remove("scrolled-out");
        section4Ref.current.classList.remove("scrolled-in");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

      {/* SECTION 3 — REVEALED PAGE (TURNING PAGE START) */}
      <section
        ref={section3Ref}
        className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden turning-page-section"
      >
        <img
          src="/images/paper-texture.png"
          alt="Paper"
          className="absolute inset-0 w-full h-full object-cover opacity-95"
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

      {/* SECTION 4 — WRITING PAGE (TURNING PAGE END) */}
      <section
        ref={section4Ref}
        className="relative min-h-screen w-full flex items-center justify-center px-6 py-24 writing-section"
        style={{
          backgroundImage: "url('/images/sand-texture.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative w-full max-w-3xl mx-auto rounded-3xl bg-[#f0e6d2] shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-stone-300 overflow-hidden writing-panel">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: "url('/images/paper-texture.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="relative z-10 px-10 py-12">
            <form onSubmit={handleSubmit}>
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
                  feedbackType === "error" ? "text-red-400" : "text-amber-400"
                }`}
              >
                {feedback}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* GLOBAL MERGED STYLES */}
      <style jsx global>{`
        /* TURNING PAGE TRANSITION */
        .turning-page-section {
          opacity: 1;
          transition: opacity 1.2s ease;
        }

        .writing-section {
          opacity: 0;
          transition: opacity 1.2s ease;
        }

        .turning-page-section.scrolled-out {
          opacity: 0;
        }

        .writing-section.scrolled-in {
          opacity: 1;
        }

        /* SECTION 3 — PAPER REVEAL */
        .paper-reveal {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          color: #3b2414;
          opacity: 0;
          animation: paperFade 3.5s ease forwards;
          text-shadow:
            0 0 1px rgba(30, 18, 10, 0.5),
            0 0 3px rgba(30, 18, 10, 0.35),
            0 0 6px rgba(30, 18, 10, 0.2);
          filter: brightness(0.95) contrast(1.05);
        }

        @keyframes paperFade {
          0% {
            opacity: 0;
            transform: translateY(10px);
            filter: blur(3px);
          }
          40% {
            opacity: 0.4;
            transform: translateY(4px);
            filter: blur(1.5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0.3px);
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
