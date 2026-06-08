"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// SEA WITHIN USERNAME RULES — with gentle emoji support
function isUsernameAllowed(username: string): boolean {
  const clean = username.trim().toLowerCase();

  if (!clean) return false;

  // Block profanity, slurs, sexual content, violence
  const bannedWords = [
    "fuck","shit","bitch","cunt","slut","whore",
    "dick","cock","pussy","sex","sexy","horny",
    "kill","murder","suicide","rape","blood","violence","gun"
  ];
  if (bannedWords.some(word => clean.includes(word))) return false;

  // Block dark / violent / sexual emojis
  const bannedEmojis = [
    "💀","☠️","🔪","🩸","🧟","👿","😈","🕷️",
    "🍆","🍑","💦","🔞","😏","👅"
  ];
  if (bannedEmojis.some(e => username.includes(e))) return false;

  // Allow letters, spaces, hyphens, apostrophes, and emojis
  // Block numbers and symbols except gentle punctuation
  const allowedPattern = /^[a-zA-Z\s'’-🌸✨🌿🪽🕊️💫🌙🌞🌱🌷🌻🌼🌟]+$/u;
  if (!allowedPattern.test(username)) return false;

  // Word count: allow poetic names (1–4 words)
  const words = clean.split(/\s+/);
  if (words.length > 4) return false;

  // Length rules
  if (username.length < 3 || username.length > 30) return false;

  return true;
}


export default function UsernameModal({ onComplete }: { onComplete: () => void }) {
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const saveUsername = async () => {
    setFeedback("");

    if (!isUsernameAllowed(username)) {
      setFeedback("This name doesn’t align with the Sanctuary’s energy.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setFeedback("You must be signed in to choose a Sanctuary name.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    if (error) {
      setFeedback("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onComplete(); // Close modal + refresh parent
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-sanctuary-dark border border-white/10 rounded-xl p-8 max-w-sm w-full text-center shadow-xl">
        <h2 className="font-display text-xl text-sea-100 mb-2">
          Choose Your Sanctuary Name
        </h2>

        <p className="font-body text-sm text-white/40 mb-6">
          This name will represent you in the Sanctuary.
        </p>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
          placeholder="Your chosen name"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                     text-sea-100 font-body text-sm placeholder:text-white/20
                     focus:outline-none focus:border-golden-400/40 transition"
        />

        {feedback && (
          <p className="text-golden-300 text-xs mt-3">{feedback}</p>
        )}

        <button
          onClick={saveUsername}
          disabled={loading || username.trim().length < 3}
          className="mt-6 w-full bg-gradient-to-br from-golden-400 to-golden-600
                     text-sanctuary-dark font-body text-xs tracking-[2px] uppercase
                     py-3 rounded-lg transition disabled:opacity-40"
        >
          {loading ? "Saving..." : "Save Name"}
        </button>
      </div>
    </div>
  );
}
