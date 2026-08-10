"use client";



import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";




export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function finishMagicLink() {
      // Wait for Supabase to detect the session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth/signin");
        return;
      }

      const user = session.user;

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_member, membership_status")
        .eq("id", user.id)
        .single();

      // If no profile → send to username creation
      if (!profile) {
        router.replace("/create-username");
        return;
      }

      // If member → sanctuary
      if (profile.is_member === true) {
        router.replace("/sanctuary");
        return;
      }

      // If NOT a member → reveal page
      router.replace("/reveal");
    }

    finishMagicLink();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] text-white">
      <p className="text-center opacity-70">Completing sign-in...</p>
    </div>
  );
}
