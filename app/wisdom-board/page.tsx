"use client";

import { useState, useEffect, type FormEvent } from "react";
import Navigation from "@/components/layout/Navigation";

interface WisdomPost {
  id: string;
  content: string;
  created_at: string;
}

export default function WisdomBoardPage() {
  const [posts, setPosts] = useState<WisdomPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");

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

      {/* SECTION 2 — BOTTLE */}
      <section className="relative h-[165vh] w-full bg-black flex items-center justify-center overflow-hidden">
        <video
          id="bottleVideo"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 70%" }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/ocean-bottle.mp4" type="video/mp4" />
        </video>
      </section>

      {/* SECTION 3 — DAILY MESSAGE ON PARCHMENT */}
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

      {/* ⭐ SECTION 4 — TRUE FULLSCREEN 50/50 SPLIT */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">

          {/* LEFT — FULLSCREEN VIDEO */}
          <div className="relative h-full w-full">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/ocean-wisdom.mp4" type="video/mp4" />
            </video>
          </div>

          {/* RIGHT — FULLSCREEN PARCHMENT WITH INVITATION + TEXTAREA */}
          <div className="relative h-full w-full">
            <img
              src="/images/paper-texture.png"
              alt="Paper"
              className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
            />

            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-10 text-center">

              {/* Engraved Invitation */}
              <p className="paper-reveal text-3xl leading-relaxed mb-10 max-w-md">
                Send good vibes and light to the community.
              </p>

              {/* Writing Form */}
              <form onSubmit={handleSubmit} className="w-full max-w-md">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                 placeholder="Offer a helping hand — your words may be someone’s light today."
                  className="w-full h-48 bg-transparent resize-none focus:outline-none text-xl leading-relaxed ink-writing placeholder:text-stone-500"
                />

                <button
                  type="submit"
                  disabled={isSubmitting || !newPost.trim()}
                  className="mt-6 px-8 py-3 bg-amber-600/80 hover:bg-amber-500 text-white rounded-full transition-all disabled:opacity-40"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>

              {/* Feedback */}
              {feedback && (
                <p
                  className={`mt-4 text-sm ${
                    feedbackType === "error" ? "text-red-400" : "text-amber-600"
                  }`}
                >
                  {feedback}
                </p>
              )}

              {/* Auto-fill Note */}
              <p className="mt-4 text-xs text-stone-700/85">
                Your message will be shared anonymously with the community, along with your
                country and today&apos;s date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        .paper-reveal {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          color: #4a2e1a;
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
