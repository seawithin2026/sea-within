'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPassword() {
  const supabase = createClient();

  
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Supabase sometimes uses "code" instead of "token"
    const t = params.get("token") || params.get("code");
    const type = params.get("type");

    if (!t || type !== "recovery") {
      setStatus("Invalid or missing recovery token.");
      return;
    }

    setToken(t);

    supabase.auth.exchangeCodeForSession(t)
      .then(({ error }) => {
        if (error) {
          console.error(error);
          setStatus("Error starting recovery session.");
        } else {
          setStatus("Recovery session active. Enter your new password.");
        }
      });
  }, []);

  async function handleReset() {
    setStatus("Updating password...");

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error(error);
      setStatus("Error updating password.");
      return;
    }

    setStatus("Password updated successfully!");
  }

  return (
    <div>
      <h1>Reset Password</h1>
      <p>{status}</p>

      {token && (
        <div>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleReset}>
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
}
