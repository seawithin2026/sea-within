"use client";



import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";



export default function CallbackPage() {
  const router = useRouter();

  
  useEffect(() => {
    async function completeSignIn() {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/auth/signin");
        return;
      }

      const session = data.session;
      const user = session.user;

      // Merge any email-only profile into the auth-linked profile
      try {
        await fetch("/api/profile/merge-from-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
          }),
        });
      } catch (e) {
        // swallow merge errors; user can still proceed
      }

      router.replace("/sanctuary");
    }

    completeSignIn();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] text-white">
      <p className="text-center opacity-70">Completing signin...</p>
    </div>
  );
}
