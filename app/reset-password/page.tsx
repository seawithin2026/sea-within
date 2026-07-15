'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPassword() {
  const supabase = createClient();

 
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token") || params.get("code");
    const type = params.get("type");

    if (!token || type !== "recovery") {
      setStatus("Invalid or missing recovery token.");
      return;
    }

    async function startSession() {
      const { error } = await supabase.auth.exchangeCodeForSession(token);

      if (error) {
        console.error(error);
        setStatus("Error starting recovery session.");
        return;
      }

      setSessionReady(true);
      setStatus("Enter your new password.");
    }

    startSession();
  }, []);

  async function handleReset() {
    setStatus("Updating password...");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error(error);
      setStatus("Error updating password.");
      return;
    }

    setStatus("Password updated successfully. Redirecting...");
    setTimeout(() => {
      window.location.href = "/sign-in";
    }, 2000);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-transparent">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">

        <h1 className="font-display text-2xl text-center text-[#E8D7B8] mb-6">
          Reset Password
        </h1>

        <p className="text-center text-sm text-[#E8D7B8]/80 mb-6">
          {status}
        </p>

        {sessionReady && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-[#E8D7B8] mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-[#E8D7B8]"
              />
            </div>

            <button
              onClick={handleReset}
              disabled={!password.trim()}
              className="w-full bg-gradient-to-br from-golden-400 to-golden-600 text-sanctuary-dark rounded-lg py-3 font-body text-sm tracking-[2px] uppercase disabled:opacity-40"
            >
              Update Password
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
