"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://www.seawithinyourself.com/reset-password",
    });

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Check your email for the reset link.");
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
          />

          {error && (
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          {message && (
            <p className="text-green-400 text-sm text-center">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </main>
  );
}
