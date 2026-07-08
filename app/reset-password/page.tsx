"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⭐ Exchange Supabase recovery code for a valid session
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    supabase.auth.exchangeCodeForSession(code).catch(() => {
      setFeedback("Your reset link has expired. Please request a new one.");
    });
  }, [searchParams, supabase]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback("");
    setIsSubmitting(true);

    // ⭐ Dynamic validation — ONLY shown when user messes up
    if (password.length < 6) {
      setFeedback("Password must be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    if (password.length > 72) {
      setFeedback("Password is too long. Maximum allowed is 72 characters.");
      setIsSubmitting(false);
      return;
    }

    // ⭐ Attempt password update
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      const msg = error.message.toLowerCase();

      if (
        msg.includes("similar") ||
        msg.includes("previous") ||
        msg.includes("old") ||
        msg.includes("reused")
      ) {
        setFeedback("You must use a password you have never used before.");
      } else {
        setFeedback("Something went wrong. Please try again.");
      }

      setIsSubmitting(false);
      return;
    }

    // ⭐ Success
    setFeedback("Your password has been updated. Redirecting…");

    setTimeout(() => {
      router.push("/sign-in");
    }, 1500);
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

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-[#E8D7B8]"
              />

              {/* ⭐ Elegant Sea Within eye toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#E8D7B8]/70"
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3l18 18M10.477 10.477A3 3 0 0113.5 13.5m-1.477 1.477A3 3 0 0110.5 10.5m9.5 1.5c0 1.02-.152 2.005-.435 2.94a9.958 9.958 0 01-3.07 3.07M6.005 6.005A9.958 9.958 0 003 12c0 5.523 4.477 10 10 10 1.02 0 2.005-.152 2.94-.435"
                    />
                  </svg>
                ) : (
                  // Eye icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.02.152-2.005.435-2.94m3.07-3.07A9.958 9.958 0 0112 3c5.523 0 10 4.477 10 10 0 1.02-.152 2.005-.435 2.94M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
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
