'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Read query params from the URL
    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");
    const type = params.get("type");

    // If anything is missing, redirect safely
    if (!code || !type) {
      router.replace("/reset-password?error=missing");
      return;
    }

    // Store token safely so hydration or browser quirks can't erase it
    localStorage.setItem("supabase_recovery_code", code);
    localStorage.setItem("supabase_recovery_type", type);

    // ✅ FIX: pass the token forward to the reset page
    router.replace(`/reset-password?code=${code}`);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A1628]">
      <p className="text-white/80 text-center">
        Redirecting securely…
      </p>
    </main>
  );
}
