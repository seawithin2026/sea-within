"use client";
        
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Waiting for recovery event...");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
          setStatus("Enter your new password.");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleUpdate() {
    if (password.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setStatus("Updating password...");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Password updated! You can now sign in.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <h1 className="text-2xl mb-4">Reset Password</h1>
        <p className="mb-4">{status}</p>

        {ready && (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded border border-white/30 bg-white/5"
              placeholder="New password"
            />

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full py-2 rounded bg-yellow-500 text-black disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
