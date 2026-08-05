export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  async function handleMagicLink(e) {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    // Save email locally
    localStorage.setItem("rememberedEmail", email);

    // Save Stripe session_id from URL
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      localStorage.setItem("stripe_session_id", sessionId);
    }

    // Build redirect URL including session_id
    const redirectUrl = `https://www.seawithinyourself.com/auth/callback?session_id=${localStorage.getItem(
      "stripe_session_id"
    )}`;

    // Send magic link with session_id preserved
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setStatus("Magic link sent! Check your email.");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] px-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-10 max-w-sm w-full backdrop-blur-xl">
        <h1 className="text-golden-400 font-display text-xl tracking-[3px] mb-6 text-center">
          Sign In
        </h1>

        <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="bg-white/10 text-white px-4 py-3 rounded-md outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {status && (
            <p className="text-golden-400 text-sm text-center">{status}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

