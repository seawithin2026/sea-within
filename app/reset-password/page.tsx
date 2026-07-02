"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");

  // ⭐ Prefill email from redirect
  useEffect(() => {
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    // ⭐ Verify OTP code
    const { error: otpError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "recovery",
    });

    if (otpError) {
      setFeedback("Invalid or expired code. Please try again.");
      return;
    }

    // ⭐ Update password
    const { error: pwError } = await supabase.auth.updateUser({
      password,
    });

    if (pwError) {
      setFeedback("Could not update password. Try again.");
      return;
    }

    setFeedback("Your password has been reset successfully.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-10 max-w-sm w-full backdrop-blur-xl">
        <h1 className="text-golden-400 font-display text-xl tracking-[3px] mb-4 text-center">
          Reset Password
        </h1>

        <p className="text-center text-sm text-[#3A8C8C] mb-6">
          A reset code has been sent to your email.  
          Enter it below to continue.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="bg-white/10 text-white px-4 py-3 rounded-md outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Reset code"
            className="bg-white/10 text-white px-4 py-3 rounded-md outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="New password"
            className="bg-white/10 text-white px-4 py-3 rounded-md outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {feedback && (
            <p className="text-center text-golden-300 text-sm">{feedback}</p>
          )}

          <button
            type="submit"
            className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
