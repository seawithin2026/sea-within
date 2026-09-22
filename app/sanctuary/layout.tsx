"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import UsernameModal from "@/components/UsernameModal";
import "../globals.css";

export default function SanctuaryLayout({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Hydration guard
  useEffect(() => {
    setReady(true);
  }, []);

  // Client-side auth + profile fetch
  useEffect(() => {
    if (!ready) return;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUser(null);
        return;
      }

      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, membership_status")
        .eq("id", user.id)
        .single();

      setProfile(profileData);
    }

    load();
  }, [ready]);

  // Hydration-safe skeleton
  if (!ready || user === null || profile === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 tracking-[3px] uppercase">
          Loading Sanctuary…
        </p>
      </div>
    );
  }

  // Membership access check
  const status = profile.membership_status?.toLowerCase();
  const hasAccess = status === "active" || status === "cancelling";

  if (!hasAccess) {
    // Client-side redirect
    window.location.href = "/reveal";
    return null;
  }

  return (
    <>
      {!profile.username && <UsernameModal onComplete={() => {}} />}
      {children}
    </>
  );
}
