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
  // POSTS + WISDOM BOARD STATE
  const [posts, setPosts] = useState<WisdomPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const [messageOpened, setMessageOpened] = useState(false);

  // DAILY MESSAGE (SECTION 3)
  const dailyMessage = {
    text: "You are more held by life than you realize.",
    attribution: "Anonymous — Japan — May 10, 2026",
  };

  // Slow down bottle video to 0.5x
  useEffect(() => {
    const bottle = document.getElementById("bottleVideo") as HTMLVideoElement | null;
    if (bottle) bottle.playbackRate = 0.5;
  }, []);

  // FETCH POSTS ON LOAD
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

  // SUBMIT NEW MESSAGE (USED IN SECTION 4)
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

  // EDITING EXISTING POSTS
  const startEditing = (post: WisdomPost) => {
    setEditingId(post.id);
    setEditingContent(post.content);
  };

  const saveEdit = async () => {
    if (!editingId) return;

    await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        content: editingContent,
        type: "wisdom",
      }),
    });

    setEditingId(null);
    setEditingContent("");
    fetchPosts();
  };

  // DELETE POST
  const deletePost = async (id: string) => {
    const confirmDelete = confirm("Delete this reflection?");
    if (!confirmDelete) return;

    await fetch(`/api/messages?id=${id}&type=wisdom`, {
      method: "DELETE",
    });

    fetchPosts();
  };

  // DATE FORMATTER
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-CA", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // RETURN STARTS BELOW
  return (
    <main className="min-h-screen bg-sanctuary-dark">
      <Navigation />

      {/* SECTION 1 — OCEAN HERO */}
      <section className="relative h-[150vh] w-full bg-black flex items-center justify-center overflow-hidden">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/ocean-hero.mp4" type="video/mp4" />
        </video>
      </section>

      {/* SECTION 2 — BOTTLE VIDEO */}
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

      {/* SECTION 3 — DAILY MESSAGE REVEAL */}
      <section className="relative min-h-screen w-full flex items-center justify-center px-6 py-24 bg-slate-950">
        <div className="w-full max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-200/70 mb-6">
            Today&apos;s Message
          </p>

          <div className="relative rounded-3xl border border-sky-200/15 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(15,23,42,0.9)] overflow-hidden">
            <img
              src="/images/paper-texture.png"
              alt="Paper background"
              className="absolute inset-0 w-full h-full object-cover opacity-95 z-0"
            />

            <div className="relative px-10 py-14 z-10">
              <p className="ink-reveal text-xl leading-relaxed mb-6">
                {dailyMessage?.text || "A new message will appear here soon."}
              </p>

              <p className="ink-reveal text-sm opacity-80 mt-4">
                {dailyMessage?.attribution || ""}
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          .ink-reveal {
            font-family: "Cormorant Garamond", serif;
            font-style: italic;
            color: #2b1a10;
            opacity: 0;
            animation: inkFade 3s ease forwards;
            text-shadow:
              0 0 2px rgba(43, 26, 16, 0.4),
              0 0 6px rgba(43, 26, 16, 0.25),
              0 0 10px rgba(43, 26, 16, 0.15);
            background: radial-gradient(
              circle at 50% 50%,
              rgba(43, 26, 16, 0.9),
              rgba(43, 26, 16, 0.3)
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: blur(0.3px) brightness(1.1) contrast(0.9);
          }

          @keyframes inkFade {
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

      {/* SECTION 4 — WRITE A MESSAGE IN THE SEA WITHIN BOOK */}
      <section className="relative min-h-screen w-full flex items-center justify-center px-6 py-24 bg-slate-950">
        <div className="w-full max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-200/70 mb-6">
            Send a message to the world
          </p>

          <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(15,23,42,0.9)]">
            <img
              src="/images/sea-within-book-open.png"
              alt="Open Sea Within Book"
              className="absolute inset-0 w-full h-full object-cover opacity-95 z-0"
            />

            <div className="relative z-10 px-10 py-16">
              <form onSubmit={handleSubmit}>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Write your message here…"
                  className="w-full h-48 bg-transparent resize-none focus:outline-none text-xl leading-relaxed ink-writing placeholder:text-stone-400"
                />

                <button
                  type="submit"
                  disabled={isSubmitting || !newPost.trim()}
                  className="mt-6 px-8 py-3 bg-amber-600/80 hover:bg-amber-500 text-white rounded-full transition-all disabled:opacity-40"
                >
                  {isSubmitting ? "Sending..." : "Send Wisdom"}
                </button>
              </form>

              {feedback && (
                <p
                  className={`mt-4 text-sm ${
                    feedbackType === "error" ? "text-red-300" : "text-amber-300"
                  }`}
                >
                  {feedback}
                </p>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .ink-writing {
            font-family: "Cormorant Garamond", serif;
            font-style: italic;
            color: #2b1a10;
            text-shadow:
              0 0 2px rgba(43, 26, 16, 0.4),
              0 0 6px rgba(43, 26, 16, 0.25),
              0 0 10px rgba(43, 26, 16, 0.15);
            background: radial-gradient(
              circle at 50% 50%,
              rgba(43, 26, 16, 0.9),
              rgba(43, 26, 16, 0.3)
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: blur(0.3px) brightness(1.1) contrast(0.9);
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

      {/* SECTION 5 — WISDOM BOARD (PARCHMENT CARDS) */}
      <section className="relative min-h-screen w-full px-6 py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-200/70 mb-10 text-center">
            Wisdom Board
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="relative rounded-2xl border border-amber-200/20 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(15,23,42,0.7)] overflow-hidden p-6"
              >
                <img
                  src="/images/paper-texture.png"
                  alt="Paper"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 z-0"
                />

                <div className="relative z-10">
                  {editingId === post.id ? (
                    <>
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full h-32 bg-transparent resize-none focus:outline-none text-sm leading-relaxed ink-writing"
                      />
                      <div className="mt-3 flex gap-3">
                        <button
                          onClick={saveEdit}
                          className="text-amber-300 hover:text-amber-200 text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingContent("");
                          }}
                          className="text-sky-300 hover:text-sky-200 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="ink-writing text-lg mb-4">{post.content}</p>
                      <p className="ink-writing text-xs opacity-80">
                        — {post.author}, {formatDate(post.created_at)}
                      </p>

                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => startEditing(post)}
                          className="text-amber-300 hover:text-amber-200 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-red-300 hover:text-red-200 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
