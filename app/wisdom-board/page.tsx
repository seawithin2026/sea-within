"use client";

import { useState, useEffect } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      <section className="relative h-[150vh] w-full bg-black flex items-center justify-center overflow-hidden">
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

{/* SECTION 3 — DAILY MESSAGE VIDEO REVEAL */}
<section className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden">

  {/* Background video with green removed */}
  <video
    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
    autoPlay
    muted
    playsInline
  >
    <source src="/videos/script-unfold.mp4" type="video/mp4" />
  </video>

  {/* Parchment + Text */}
  <div className="relative z-10 max-w-3xl mx-auto px-6 py-20">

    {/* Title */}
    <p className="text-xs uppercase tracking-[0.25em] text-sky-200/70 mb-6 text-center">
      Today&apos;s Message
    </p>

    {/* Parchment container */}
    <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">

      {/* Parchment texture */}
      <img
        src="/images/paper-texture.png"
        alt="Paper"
        className="absolute inset-0 w-full h-full object-cover opacity-95"
      />

      {/* Text written directly on the parchment */}
      <div className="relative z-10 px-10 py-14 text-center">
        <p className="script-reveal text-xl leading-relaxed mb-6">
          {dailyMessage?.text}
        </p>

        <p className="script-reveal text-sm opacity-80 mt-4">
          {dailyMessage?.attribution}
        </p>
      </div>
    </div>
  </div>

  <style jsx>{`
    .script-reveal {
      font-family: "Cormorant Garamond", serif;
      font-style: italic;
      color: #3b2414; /* warm ink that blends with parchment */
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
        <div className="relative w-full max-w-3xl mx-auto rounded-3xl bg-[#f7f2e8] shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-stone-300 overflow-hidden">

          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
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
                className="w-full h-64 bg-transparent resize-none focus:outline-none text-xl leading-relaxed ink-writing placeholder:text-stone-400"
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

       <style jsx>{`
  .ink-writing {
    font-family: "Cormorant Garamond", serif;
    font-style: italic;
    color: #3b2414; /* deeper warm ink */
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
      </section>
    </main>
  );
}
