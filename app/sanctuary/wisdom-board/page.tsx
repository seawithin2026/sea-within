"use client";


import Navigation from "@/components/layout/Navigation";
import { useState, useEffect, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";

interface WisdomPost {
  id: string;
  content: string;
  created_at: string;
  username?: string;
  country?: string;
}

interface DailyMessage {
  message: string;
  attribution?: string;
}

export default function WisdomBoardPage() {

  const [allowed, setAllowed] = useState<boolean | null>(null);

  // ⭐ CLIENT MEMBERSHIP GATE
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setAllowed(false);

      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .single();

      const status = profile?.membership_status;

      const isMember =
        status === "active" ||
        status === "cancel_at_period_end" ||
        status === "trialing" ||
        status === "past_due" ||
        status === "cancelling";

      if (!isMember) return setAllowed(false);

      setAllowed(true);
    };

    check();
  }, []);

  if (allowed === null) return null;
  if (allowed === false) {
    if (typeof window !== "undefined") window.location.href = "/reveal";
    return null;
  }

  return <ClientWisdomBoard />;
}

/* -----------------------------------------------------
   ⭐ CLIENT COMPONENT FOR INTERACTIVITY
----------------------------------------------------- */
function ClientWisdomBoard() {
  const [posts, setPosts] = useState<WisdomPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error">("success");

 
  const [dailyMessage, setDailyMessage] = useState<DailyMessage | null>(null);


  /* Slow bottle video */
  useEffect(() => {
    const bottle = document.getElementById("bottleVideo") as HTMLVideoElement | null;
    if (bottle) bottle.playbackRate = 0.5;
  }, []);

  /* Load posts + daily message */
  useEffect(() => {
    fetchPosts();
    fetchDailyMessage();
  }, []);

  const fetchDailyMessage = async () => {
    try {
      const res = await fetch("/api/daily-affirmation");
      const data = await res.json();

      setDailyMessage({
        message: data.message,
        attribution: data.attribution || "",
      });
    } catch {
      setDailyMessage({
        message: "A new message will arrive soon.",
        attribution: "",
      });
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/wisdom");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      console.error("Failed to fetch posts");
    }
  };

  /* -----------------------------------------------------
     ⭐ CLEAN — USE NEW API + wisdom_posts
  ----------------------------------------------------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsSubmitting(true);
    setFeedback("");

    try {
      const res = await fetch("/api/wisdom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost }),
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

      {/* SECTION 1 — OCEAN HERO */}
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

      {/* SECTION 4 — FULLSCREEN 50/50 SPLIT */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
        
          {/* LEFT — VIDEO */}
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

          {/* RIGHT — PARCHMENT */}
          <div className="relative h-full w-full">
            <img
              src="/images/paper-texture.png"
              alt="Paper"
              className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
            />

            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-10 text-center">
              <p className="paper-reveal text-3xl leading-relaxed mb-6 max-w-md">
                {dailyMessage?.message || "Loading..."}
              </p>

              {dailyMessage?.attribution && (
                <p className="paper-reveal text-base opacity-80 mb-10">
                  {dailyMessage.attribution}
                </p>
              )}

              <div className="mt-14"></div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="w-full max-w-md">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Offer a helping hand by sending a message — your words may be someone’s light today."
                  className="w-full h-48 bg-transparent resize-none focus:outline-none text-xl leading-relaxed ink-writing placeholder:text-stone-600"
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
                Your message will be shared with the community along with your username, country, and today&apos;s date.
              </p>

              {/* ⭐ DISPLAY POSTS */}
              <div className="mt-20 w-full max-w-md text-left">
                {posts.map((post) => (
                  <div key={post.id} className="mb-10">
                    <p className="text-xl text-[#3b2414] leading-relaxed mb-2">
                      {post.content}
                    </p>

                    <p className="text-sm text-stone-700/85 italic">
                      {post.username || "Unknown"} • {post.country || "Unknown"} •{" "}
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>

                    <div className="h-px w-full bg-stone-300/40 mt-4"></div>
                  </div>
                ))}
              </div>

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
          text-shadow: 0 1px 0 rgba(0, 0, 0, 0.12),
            0 2px 1px rgba(0, 0, 0, 0.1), 0 0 8px rgba(0, 0, 0, 0.08);
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
          text-shadow: 0 0 1px rgba(30, 18, 10, 0.5),
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
