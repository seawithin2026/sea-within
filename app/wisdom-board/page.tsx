"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import ScrollReveal from "@/components/ui/ScrollReveal";

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

  const [messageOpened, setMessageOpened] = useState(false);

  const dailyMessage = {
    text: "You are more held by life than you realize.",
    attribution: "Anonymous — Japan — May 10, 2026",
  };

  // ⭐ Slow down bottle video to 0.5x
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

  const deletePost = async (id: string) => {
    const confirmDelete = confirm("Delete this reflection?");
    if (!confirmDelete) return;

    await fetch(`/api/messages?id=${id}&type=wisdom`, {
      method: "DELETE",
    });

    fetchPosts();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-CA", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-sanctuary-dark">
      <Navigation />

      {/* SECTION 1 */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full min-h-screen object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          webkit-playsinline="true"
        >
          <source src="/videos/ocean-hero.mp4" type="video/mp4" />
        </video>
      </section>

      {/* SECTION 2 */}
      <section className="relative h-screen w-full overflow-hidden">
  <video
    id="bottleVideo"
    className="absolute inset-0 w-full h-full min-h-screen object-cover"
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    disablePictureInPicture
    webkit-playsinline="true"
  >
    <source src="/videos/ocean-bottle.mp4" type="video/mp4" />
  </video>
</section>

      {/* SECTION 3, 4, 5 — your existing code continues below */}


{/* -------------------------------------------------- */}
{/* SECTION 3 — DAILY MESSAGE REVEAL (WITH PAPER BACKGROUND) */}
{/* -------------------------------------------------- */}
<section className="relative min-h-screen flex items-center justify-center px-6 py-24 bg-slate-950">
  <div className="max-w-xl w-full text-center">
    <p className="text-xs uppercase tracking-[0.25em] text-sky-200/70 mb-4">
      Today&apos;s message
    </p>

    <div
      className={[
        "relative rounded-3xl border border-sky-200/15 bg-white/5 backdrop-blur-xl px-0 py-0 shadow-[0_0_60px_rgba(15,23,42,0.9)] overflow-hidden transition-all duration-700",
        messageOpened
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none",
      ].join(" ")}
    >
      {/* Paper background */}
      <img
        src="/images/paper-texture.png"
        alt="Paper background"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />

      {/* Message text */}
      <div className="relative px-8 py-10">
        <p className="sea-worn-ink text-lg mb-6">
          {dailyMessage.text}
        </p>

        <p className="sea-worn-ink text-xs opacity-80">
          {dailyMessage.attribution}
        </p>
      </div>
    </div>
  </div>
</section>

<style jsx>{`
  .sea-worn-ink {
    font-family: "Cormorant Garamond", serif;
    font-style: italic;
    color: #2b1a10;
    text-shadow:
      0 0 2px rgba(43, 26, 16, 0.4),
      0 0 6px rgba(43, 26, 16, 0.25),
      0 0 10px rgba(43, 26, 16, 0.15);
    filter: blur(0.35px) brightness(1.1) contrast(0.9);
    opacity: 0.92;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(43, 26, 16, 0.9),
      rgba(43, 26, 16, 0.3)
    );
  }
`}</style>


      {/* -------------------------------------------------- */}
      {/* SECTION 4 — SEND A MESSAGE TO THE WORLD */}
      {/* -------------------------------------------------- */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <ScrollReveal>
          <form onSubmit={handleSubmit} className="sanctuary-card p-8">
            <label className="block font-body text-[11px] tracking-[2px] uppercase text-white/40 mb-3">
              Send a message to someone in the world
            </label>

            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Send a positive gift of wisdom…"
              rows={4}
              maxLength={500}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 font-body text-sea-100 placeholder:text-white/20 resize-none focus:outline-none focus:border-golden-400/40 focus:bg-white/8 transition-all duration-300"
            />

            <div className="flex justify-between items-center mt-3">
              <p className="font-body text-[11px] text-white/20">{newPost.length}/500</p>
              <button
                type="submit"
                disabled={isSubmitting || !newPost.trim()}
                className="btn-golden text-[11px] px-6 py-2.5 disabled:opacity-40"
              >
                {isSubmitting ? "Sending..." : "Send Wisdom"}
              </button>
            </div>

            {feedback && (
              <div
                className={`mt-4 p-4 rounded-lg border text-sm font-body ${
                  feedbackType === "success"
                    ? "bg-sea-400/10 border-sea-400/20 text-sea-200"
                    : "bg-golden-400/10 border-golden-400/20 text-golden-300"
                }`}
              >
                {feedback}
              </div>
            )}
          </form>
        </ScrollReveal>
      </section>

      {/* -------------------------------------------------- */}
      {/* SECTION 5 — WISDOM BOARD (YOUR EXISTING GRID) */}
      {/* -------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {posts.map((post, index) => (
            <ScrollReveal key={post.id} delay={100 + index * 50}>
              <div className="wisdom-card break-inside-avoid">
                {editingId === post.id ? (
                  <div>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sea-100"
                      rows={4}
                    />

                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={saveEdit}
                        className="text-golden-400/70 hover:text-golden-400/90 text-xs transition-colors duration-300"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="text-golden-400/40 hover:text-golden-400/70 text-xs transition-colors duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="font-display text-lg font-light text-sea-100/80 leading-relaxed italic whitespace-pre-line">
                    &ldquo;{post.content}&rdquo;
                  </p>
                )}

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                  <p className="font-body text-[11px] text-golden-400/50 tracking-wide">
                    {post.author}
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={() => startEditing(post)}
                      className="text-golden-400/60 hover:text-golden-400/90 text-xs transition-colors duration-300"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-golden-400/40 hover:text-golden-400/70 text-xs transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="font-body text-[11px] text-white/20">
                    {formatDate(post.created_at)}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}

          {posts.length === 0 && (
            <div className="col-span-2 text-center py-16">
              <p className="font-display text-xl text-white/20 font-light">
                The board awaits its first reflection.
              </p>
              <p className="font-body text-sm text-white/10 mt-3">
                Be the first to share your truth.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
