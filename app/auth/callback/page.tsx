"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function finishMagicLink() {
  
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/signin");
        return;
      }

      const user = session.user;


      await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          joined_at: new Date().toISOString(),
        });

   
        let sessionId = searchParams.get("session_id");

      if (!sessionId) {
        sessionId = localStorage.getItem("stripe_session_id");
      }

  
      if (sessionId) {
        localStorage.setItem("stripe_session_id", sessionId);
      }

  
      if (sessionId) {
   
        const res = await fetch(
          "/api/stripe/get-session?session_id=" + sessionId
        );
        const stripeSession = await res.json();

  
        if (stripeSession?.customer) {
    
          await supabase
            .from("profiles")
            .update({
              stripe_customer_id: stripeSession.customer,
            })
            .eq("id", user.id);
        }
      }


      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_member, username")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        router.push("/auth/signin");
        return;
      }


      localStorage.setItem("isMember", profile.is_member ? "true" : "false");


      if (!profile.username) {
        router.push("/create-username");
        return;
      }


      if (profile.is_member) {
        router.push("/sanctuary");
        return;
      }

 
      router.push("/reveal");
    }

    finishMagicLink();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1628] text-white">
      <p className="text-center opacity-70">Completing signin...</p>
    </div>
  );
}
