"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");

  const [errorMsg, setErrorMsg] = useState("");

  // Consent logic
  const [needsConsent, setNeedsConsent] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  /* -----------------------------------------------------
     🌿 CHECK CONSENT STATUS WHEN USER TYPES EMAIL
  ----------------------------------------------------- */
  const checkConsent = async (emailValue: string) => {
    setEmail(emailValue);

    if (!emailValue) {
      setNeedsConsent(true);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("terms_accepted")
      .eq("email", emailValue)
      .maybeSingle();

    if (data && data.terms_accepted === true) {
      setNeedsConsent(false);
    } else {
      setNeedsConsent(true);
    }
  };

  /* -----------------------------------------------------
     🌿 SEND OTP CODE
  ----------------------------------------------------- */
  const sendCode = async () => {
    setErrorMsg("");

    if (needsConsent && !termsAccepted) {
      setErrorMsg("You must agree to the Terms and Privacy Policy to continue.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setStage("code");
  };

  /* -----------------------------------------------------
     🌿 VERIFY OTP CODE
  ----------------------------------------------------- */
  const verifyCode = async () => {
    setErrorMsg("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // SUCCESS → Supabase session created
    window.location.href = "/"; // AccountRouter takes over
  };

  /* -----------------------------------------------------
     🌿 RENDER
  ----------------------------------------------------- */
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#0A1628] text-white">
      <div className="max-w-sm w-full text-center">

        {/* -----------------------------------------------------
            🌿 EMAIL STAGE
        ----------------------------------------------------- */}
        {stage === "email" && (
          <>
            <h1 className="text-[22px] tracking-[3px] mb-6 text-golden-400 font-display">
              Enter the Sanctuary
            </h1>

            <p className="text-white/60 text-[13px] tracking-[1px] mb-10">
              Receive your 6‑digit access code.
            </p>

            <input
              type="email"
              placeholder="Your email"
              className="w-full bg-white/5 border border-white/10 rounded-md py-3 px-4 text-[13px] tracking-[1px] focus:outline-none focus:border-white/30 mb-4"
              value={email}
              onChange={(e) => checkConsent(e.target.value)}
            />

            {/* Consent checkbox only if needed */}
            {needsConsent && (
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
            )}

            {errorMsg && (
              <p className="text-red-400 text-[13px] mb-4">{errorMsg}</p>
            )}

            <button
              onClick={sendCode}
              className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
            >
              SEND CODE
            </button>
          </>
        )}

        {/* -----------------------------------------------------
            🌿 CODE STAGE
        ----------------------------------------------------- */}
        {stage === "code" && (
          <>
            <h1 className="text-[22px] tracking-[3px] mb-6 text-golden-400 font-display">
              Enter Your Code
            </h1>

            <p className="text-white/60 text-[13px] tracking-[1px] mb-10">
              We sent a 6‑digit code to{" "}
              <span className="text-golden-400">{email}</span>.
            </p>

            {/* SEA WITHIN 6‑DIGIT OTP INPUT */}
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  className="w-12 h-14 text-center text-[20px] font-display 
                             bg-white/5 border border-white/10 rounded-md 
                             focus:outline-none focus:border-golden-400 
                             text-golden-400 tracking-[3px]"
                  value={code[i] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/, "");
                    if (!val) return;

                    const newCode = code.split("");
                    newCode[i] = val;
                    setCode(newCode.join(""));

                    const next = document.getElementById(`otp-${i + 1}`);
                    if (next) next.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      const newCode = code.split("");
                      newCode[i] = "";
                      setCode(newCode.join(""));

                      const prev = document.getElementById(`otp-${i - 1}`);
                      if (prev) prev.focus();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
                    if (pasted.length === 6) {
                      setCode(pasted);
                      const last = document.getElementById("otp-5");
                      if (last) last.focus();
                    }
                  }}
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-red-400 text-[13px] mb-4">{errorMsg}</p>
            )}

            <button
              onClick={verifyCode}
              disabled={code.length !== 6}
              className={`btn-golden w-full py-3 text-[12px] tracking-[2px] 
                ${code.length === 6 ? "" : "opacity-40 cursor-not-allowed"}`}
            >
              VERIFY CODE
            </button>

            <p className="text-white/50 text-[12px] mt-4">
              Didn’t receive it?{" "}
              <button
                onClick={sendCode}
                className="underline text-golden-400"
              >
                Resend
              </button>
            </p>
          </>
        )}

      </div>
    </main>
  );
}
