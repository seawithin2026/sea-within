"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function JoinPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const sendLink = async () => {
    setErrorMsg("");

    // Block sending magic link unless user agrees to Terms + Privacy
    if (!termsAccepted) {
      setErrorMsg("You must agree to the Terms and Privacy Policy to continue.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });

    if (error) {
      if (error.message.includes("rate limit")) {
        setErrorMsg("Too many attempts — please wait a moment.");
        return;
      }
      setErrorMsg(error.message);
      return;
    }

    setSent(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#0A1628] text-white">
      <div className="max-w-sm w-full text-center">
        {!sent ? (
          <>
            <h1 className="text-[22px] tracking-[3px] mb-6 text-golden-400 font-display">
              Enter the Sanctuary
            </h1>

            <p className="text-white/60 text-[13px] tracking-[1px] mb-10">
              Receive your magic link to enter.
            </p>

            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-white/5 border border-white/10 rounded-md py-3 px-4 text-[13px] tracking-[1px] focus:outline-none focus:border-white/30 mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* LEGAL CONSENT CHECKBOX */}
            <label className="flex items-center gap-2 text-[12px] text-white/70 mb-4 text-left">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 accent-white"
              />
              <span>
                I agree to the{" "}
                <a href="/legal#terms" className="underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/legal#privacy" className="underline">
                  Privacy Policy
                </a>.
              </span>
            </label>

            {errorMsg && (
              <p className="text-red-400 text-[13px] mb-4">{errorMsg}</p>
            )}

            <button
              onClick={sendLink}
              className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
            >
              SEND MAGIC LINK
            </button>
          </>
        ) : (
          <p className="text-center text-lg text-golden-400">
            Check your email — your doorway is waiting.
          </p>
        )}
      </div>
    </main>
  );
}
