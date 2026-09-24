"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import UsernameModal from "@/components/UsernameModal";
import Navigation from "@/components/layout/Navigation"; 
import "../globals.css";

export default function SanctuaryLayout({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    async function load() {
      const { data } = await supabase.auth.getUser();
      const u = data?.user;

      if (!u) {
        setUser(null);
        return;
      }

      setUser(u);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, membership_status")
        .eq("id", u.id)
        .maybeSingle();

      if (!profileData) {
        setProfile(null);
        return;
      }

      setProfile(profileData);
    }

    load();
  }, [hydrated]);

  // ⭐ FIX: do NOT redirect — show loading until hydration finishes
  if (hydrated && user === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 tracking-[3px] uppercase">
          Loading Sanctuary…
        </p>
      </div>
    );
  }

  if (!hydrated || !user || !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 tracking-[3px] uppercase">
          Loading Sanctuary…
        </p>
      </div>
    );
  }

  return (
    <>
      {!profile.username && <UsernameModal onComplete={() => {}} />}
      <Navigation />
      {children}
    </>
  );
}
