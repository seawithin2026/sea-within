"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// 🌿 SEA WITHIN USERNAME RULES
function isUsernameAllowed(username: string): boolean {
  if (!username) return false;

  const lower = username.toLowerCase();

  // ❌ Banned emojis (sexual, violent, dark)
  const bannedEmojis = [
    "🍆", "🍑", "💦", "🔞", // sexual
    "💀", "☠️", "🩸", "🔪", "🗡️", "⚰️", // dark/violent
    "👹", "👺", "😈", "👿" // devil/demon
  ];

  if (bannedEmojis.some(e => username.includes(e))) {
    return false;
  }

  // ❌ Banned words (sexual, violent, dark, hateful, negative)
  const bannedWords = [
    // sexual
    "sex", "sexy", "horny", "porn", "slut", "whore", "dick", "pussy", "anal",
    // violence
    "kill", "murder", "stab", "shoot", "blood", "gore", "torture",
    // dark/occult
    "devil", "demon", "satan", "hell", "death", "dead", "skull", "curse",
    // negativity
    "hate", "ugly", "stupid", "loser", "idiot", "trash", "worthless",
    // self-harm
    "suicide", "selfharm", "cut", "overdose",
  ];

  if (bannedWords.some(w => lower.includes(w))) {
    return false;
  }

  // ❌ Too short or too long
  if (username.length < 2 || username.length > 30) {
    return false;
  }

  return true;
}

export default function UsernameModal({ onComplete }: { onComplete: () => void }) {
  const supabase = createClientComponentClient();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");

    // Validate username with Sea Within rules
    if (!isUsernameAllowed(username)) {
      setError("This username doesn’t align with the Sanctuary’s energy.");
      return;
    }

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in.");
      return;
    }

    // Save username to Supabase
    const { error: supaError } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    if (supaError) {
      setError("This username is already taken.");
      return;
    }

    onComplete();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/10 border border-white/20 p-8 rounded-2xl max-w-sm w-full text-center shadow-xl">
        
        <h2 className="text-xl text-white mb-4 tracking-wide">
          Choose your username to represent you in the Sanctuary
        </h2>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="
            w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 
            text-white placeholder-white/40 focus:outline-none
          "
          placeholder="Your username"
        />

        {error && (
          <p className="text-red-300 text-sm mt-2">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="
            mt-5 px-6 py-2 rounded-full bg-amber-300/20 border border-amber-300/40 
            text-amber-100 uppercase tracking-[0.2em] hover:bg-amber-300/30 
            transition-all
          "
        >
          Save Username
        </button>
      </div>
    </div>
  );
}
