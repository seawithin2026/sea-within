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

  // ⭐ Exchange Supabase recovery token for a valid session
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

    // ⭐ Validation — only shown when user messes up
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

              {/* ⭐ Elegant Sea Within eye icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#E8D7B8]/70"
              >
                {showPassword ? (
                  // Eye-off (hide)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M2.25 12s3.75-6 9.75-6c2.01 0 3.84.53 5.4 1.39M21.75 12s-3.75 6-9.75 6c-2.01 0-3.84-.53-5.4-1.39"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.88 9.88A3 3 0 0114.12 14.12"
                    />
                  </svg>
                ) : (
                  // Eye (show)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12s3.75-6 9.75-6 9.75 6 9.75 6-3.75 6-9.75 6-9.75-6-9.75-6z"
                    />
                    <circle cx="12" cy="12" r="3" />
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
