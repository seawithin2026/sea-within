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

      {/* SECTION 2 */}
      <section className="relative h-[165vh] w-full bg-black flex items-center justify-center overflow-hidden">
        <video
          id="bottleVideo"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/ocean-bottle.mp4" type="video/mp4" />
        </video>
      </section>

      {/* SECTION 3 — ELEGANT MESSAGE REVEAL ON PAPER */}
<section className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden px-6 py-24">
  
  {/* Paper background */}
  <div className="relative w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">
    <img
      src="/images/paper-texture.png"
      alt="Paper"
      className="absolute inset-0 w-full h-full object-cover opacity-95"
    />

    {/* Message content */}
    <div className="relative z-10 px-10 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-stone-600/70 mb-6">
        Today&apos;s Message
      </p>

      <p className="paper-reveal text-2xl leading-relaxed mb-6">
        {dailyMessage?.text}
      </p>

      <p className="paper-reveal text-sm opacity-80 mt-4">
        {dailyMessage?.attribution}
      </p>
    </div>
  </div>

  <style jsx>{`
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
  `}</style>
</section>


      {/* SECTION 4 — WRITE A POSITIVE MESSAGE */}
      <section
        className="relative min-h-screen w-full flex items-center justify-center px-6 py-24"
        style={{
          backgroundImage: "url('/images/sand-texture.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative w-full max-w-3xl mx-auto rounded-3xl bg-[#f0e6d2] shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-stone-300 overflow-hidden">
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

      {/* GLOBAL STYLES FOR SECTION 3 + 4 */}
      <style jsx>{`
        .script-reveal {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          color: #3b2414;
          opacity: 0;
          animation: scriptFade 4s ease forwards;
          text-shadow:
            0 0 1px rgba(30, 18, 10, 0.5),
            0 0 3px rgba(30, 18, 10, 0.35),
            0 0 6px rgba(30, 18, 10, 0.2);
          filter: brightness(0.95) contrast(1.05);
        }

        @keyframes scriptFade {
          0% {
            opacity: 0;
            filter: blur(4px);
          }
          40% {
            opacity: 0.4;
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            filter: blur(0.3px);
          }
        }

        .ink-writing {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          color: #3b2414;
          text-shadow:
            0 0 1px rgba(30, 18, 10, 0.5),
            0 0 3px rgba(30, 18, 10, 0.35),
            0 0 6px rgba(30, 18, 10, 0.2);
          filter: brightness(0.95) contrast(1.05);
          animation: inkAppear 2s ease forwards;
          opacity: 0;
        }

        @keyframes inkAppear {
          0% {
            opacity: 0;
            filter: blur(3px);
          }
          40% {
            opacity: 0.4;
            filter: blur(1.5px);
          }
          100% {
            opacity: 1;
            filter: blur(0.3px);
          }
        }
      `}</style>
    </main>
  );
}
