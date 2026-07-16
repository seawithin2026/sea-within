"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code") || params.get("token");
      const type = params.get("type");

      if (!code || !type) {
        router.replace("/reset-password?error=missing");
        return;
      }

      try {
        // Persist the recovery code and type for the reset page to consume.
        // If the type is "recovery", store that explicitly to avoid ambiguity.
        localStorage.setItem("supabase_recovery_code", code);
        localStorage.setItem("supabase_recovery_type", type === "recovery" ? "recovery" : type);
      } catch (e) {
        // ignore localStorage errors (private mode, quota, etc.)
      }

      // forward both code and type, URL-encoded
      const encodedCode = encodeURIComponent(code);
      const encodedType = encodeURIComponent(type);
      router.replace(`/reset-password?code=${encodedCode}&type=${encodedType}`);
    } catch (err) {
      // if anything unexpected happens, send user to reset page with an error flag
      console.error("AuthRedirect error:", err);
      router.replace("/reset-password?error=unexpected");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A1628]">
      <p className="text-white/80 text-center">Redirecting securely…</p>
    </main>
  );
}
