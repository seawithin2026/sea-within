"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
 
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    const v = value.trim();
    if (!v) return "Please enter your email.";
    // simple email sanity check
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(v)) return "Please enter a valid email address.";
    return null;
  };

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // create the browser client here so it only runs in the browser
      const supabase = createClient();

      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        // use your configured redirect; using absolute URL is fine if registered in Supabase
        redirectTo: "https://www.seawithinyourself.com/auth-redirect",
      });

      if (supabaseError) {
        const msg = (supabaseError.message || "").toLowerCase();

        if (msg.includes("rate limit") || msg.includes("too many requests")) {
          setError("Technical rate limit was exceeded. Try again in an hour.");
          return;
        }

        // Generic friendly error
        setError(supabaseError.message || "Unable to send reset email. Try again later.");
        return;
      }

      setMessage("Check your email for the reset link.");
      setEmail("");
    } catch (err) {
      console.error("resetPasswordForEmail unexpected error:", err);
      setError("Unexpected error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A1628] px-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-10 max-w-sm w-full backdrop-blur-xl">
    
        <h1 className="text-golden-400 font-display text-xl tracking-[3px] mb-6 text-center">
          Forgot Password
        </h1>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
     
          <input
            type="email"
            placeholder="Email"
            className="bg-white/10 text-white px-4 py-3 rounded-md outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            required
          />

          {error && (
            <p className="text-red-400 text-sm text-center" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="text-green-400 text-sm text-center" role="status">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      </div>
    </main>
  );
}
