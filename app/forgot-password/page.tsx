"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
 
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  
    setLoading(true);
    setStatus("Sending reset email...");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://your-domain.com/reset-password",
    });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Check your email for the reset link.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <form className="max-w-md w-full p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20" onSubmit={handleSubmit}>
        <h1 className="text-2xl mb-4">Forgot Password</h1>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded border border-white/30 bg-white/5"
          placeholder="you@example.com"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-yellow-500 text-black disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </form>
    </main>
  );
}
