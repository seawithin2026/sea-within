"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";


export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
 
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⭐ PERFECT: Extract ONLY the token, not the full URL
  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        setFeedback("Your reset link is invalid or expired. Please request a new one.");
        return;
      }

      // ⭐ PERFECT: Exchange ONLY the code (Supabase 2026 requirement)
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Exchange error:", error);
        setFeedback("Your reset link is invalid or expired. Please request a new one.");
      }
    };

    run();
  }, []);

  // ⭐ PERFECT: Handle password update
  const handleReset = async (e) => {
    e.preventDefault();
    setFeedback("");
    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      let message = error.message || "Something went wrong.";

      if (message.includes("6 characters")) {
        message = "Your password must be at least 6 characters long.";
      }

      if (message.includes("empty")) {
        message = "Your password cannot be empty.";
      }

      if (message.includes("different") || message.includes("similar")) {
        message = "Your new password must be different from your previous password.";
      }

      setFeedback(message);
      setIsSubmitting(false);
      return;
    }

    setFeedback("Your password has been updated. Redirecting to sign in…");
    setIsSubmitting(false);

    setTimeout(() => {
      router.push("/sign-in");
    }, 2000);
  };


  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-transparent">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <h1 className="font-display text-2xl text-center text-[#E8D7B8] mb-6">
          Reset Password
        </h1>



        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm text-[#E8D7B8] mb-2">
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-[#E8D7B8]"
            />
         
          </div>

          {feedback && (
            <p className="text-center text-sm text-golden-300">{feedback}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="w-full bg-gradient-to-br from-golden-400 to-golden-600 text-sanctuary-dark rounded-lg py-3 font-body text-sm tracking-[2px] uppercase disabled:opacity-40"
          >
            {isSubmitting ? "..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
