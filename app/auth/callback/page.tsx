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

      // User is authenticated — send them to your protected area
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
