'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
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

    // Force redirect to the real reset page
    router.replace("/reset-password");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-white/80 text-center">
        Redirecting securely…
      </p>
    </main>
  );
}
