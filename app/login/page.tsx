"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [error, setError] = useState("");

  async function sendCode() {
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setStage("code");
  }

  async function verifyCode() {
    setError("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      setError(error.message);
      return;
    }

    // SUCCESS → Supabase session created
    window.location.href = "/"; // AccountRouter will take over
  }

  return (
    <div style={{ padding: 40 }}>
      {stage === "email" && (
        <>
          <h2>Enter your email</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <button onClick={sendCode}>Send Code</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}

      {stage === "code" && (
        <>
          <h2>Enter the 6‑digit code</h2>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
          />
          <button onClick={verifyCode}>Verify Code</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
}
