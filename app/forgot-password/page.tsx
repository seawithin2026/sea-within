"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    
    setMessage("Check your email for the reset link.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-6">
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

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {message && (
            <p className="text-green-400 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
          >
            Send Reset Code
          </button>
        </form>
      </div>
    </div>
  );
}
