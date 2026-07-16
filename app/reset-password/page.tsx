// app/reset-password/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPassword() {

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string>("Initializing…");
  const [sessionReady, setSessionReady] = useState(false);
 
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

 
  const tooShort = password.length > 0 && password.length < 6;

  useEffect(() => {
    const init = async () => {
      setStatus("Checking recovery token…");

      if (typeof window === "undefined") {
        setStatus("This page must run in the browser.");
        return;
      }

      // create the browser client here so it only runs in the browser
      const supabase = createClient();

      // Prefer token persisted by auth-redirect
      const savedCode = localStorage.getItem("supabase_recovery_code");
      const savedType = localStorage.getItem("supabase_recovery_type");

      const urlParams = new URLSearchParams(window.location.search);
      const codeFromUrl = urlParams.get("code") || urlParams.get("token");
      const typeFromUrl = urlParams.get("type");

      const code = savedCode || codeFromUrl;
      const type = savedType || typeFromUrl;

      if (!code || type !== "recovery") {
        setStatus("Invalid or missing recovery token.");
        return;
      }

      // persist token for this session so hydration/redirect quirks don't lose it
      try {
        localStorage.setItem("supabase_recovery_code", code);
        localStorage.setItem("supabase_recovery_type", "recovery");
      } catch (e) {
        // ignore storage errors
      }
      setStoredToken(code);

      // Defensive cast because the SDK's TS types may not include helper methods
      const authAny = (supabase.auth as unknown) as any;

      if (!authAny?.getSessionFromUrl || typeof authAny.getSessionFromUrl !== "function") {
        console.error("Supabase client missing getSessionFromUrl. Check @supabase/supabase-js v2 and client creation.");
        setStatus("Auth client misconfigured. Check console.");
        return;
      }

      try {
        // Build a URL that includes the code so Supabase can parse it reliably
        const fakeUrl = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(code)}&type=recovery`;

        // call via the any-cast to satisfy TypeScript while still checking at runtime
        const result: any = await authAny.getSessionFromUrl({
          storeSession: true,
          url: fakeUrl,
        });

        // Normalize result shape
        const data = result?.data ?? result;
        const error = result?.error ?? null;

        if (error) {
          console.error("getSessionFromUrl error:", error);
          setStatus("The reset link is invalid or expired.");
          return;
        }

        if (!data?.session) {
          console.error("getSessionFromUrl returned no session:", data);
          setStatus("Unable to create reset session.");
          return;
        }

        setSessionReady(true);
        setStatus("Enter your new password.");
      } catch (err) {
        console.error("Unexpected error calling getSessionFromUrl:", err);
        setStatus("Unexpected error while processing reset link. Check console.");
      }
    };

    init();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleReset() {
 
    if (tooShort) {
      setStatus("Password must be at least 6 characters long.");
      return;
    }

    if (!sessionReady) {
      setStatus("Reset session not ready.");
      return;
    }

    setLoading(true);
    setStatus("Updating password…");

    try {
      // create client here to ensure browser-only creation
      const supabase = createClient();

      // Defensive cast for updateUser as well (types may differ)
      const authAny = (supabase.auth as unknown) as any;

      const result: any = await authAny.updateUser
        ? await authAny.updateUser({ password })
        : await supabase.auth.updateUser({ password });

      // Normalize result shape
      const error = result?.error ?? null;

      if (error) {
        console.error("updateUser error:", error);
        setStatus(error.message || "Error updating password.");
        setLoading(false);
        return;
      }

      try {
        localStorage.removeItem("supabase_recovery_code");
        localStorage.removeItem("supabase_recovery_type");
      } catch {}

      setStatus("Password updated successfully. Redirecting…");
      setTimeout(() => {
        window.location.href = "/sign-in";
      }, 1200);
    } catch (err) {
      console.error("Unexpected error updating password:", err);
      setStatus("Unexpected error while updating password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-transparent">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <h1 className="font-display text-2xl text-center text-[#E8D7B8] mb-6">Reset Password</h1>

        <p className="text-center text-sm text-[#E8D7B8]/80 mb-6">{status}</p>

        {sessionReady && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-[#E8D7B8] mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-[#E8D7B8]"
                aria-label="New password"
                required
              />
              {tooShort && <p className="text-red-400 text-sm mt-2">Password must be at least 6 characters long.</p>}
            </div>

            <button
              onClick={handleReset}
              disabled={!password.trim() || loading}
              className="w-full bg-gradient-to-br from-golden-400 to-golden-600 text-sanctuary-dark rounded-lg py-3 font-body text-sm tracking-[2px] uppercase disabled:opacity-40"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
