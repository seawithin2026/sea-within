"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import UsernameModal from "@/components/UsernameModal";
import Navigation from "@/components/layout/Navigation"; 
import "../globals.css";

export default function SanctuaryLayout({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    async function load() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      // ⭐ FIX: do NOT redirect yet — session may still be hydrating
      if (!user) {
        setUser(null);
        return;
      }

      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, membership_status")
        .eq("id", user.id)
        .maybeSingle();

      // ⭐ FIX: do NOT redirect yet — profile may still be loading
      if (!profileData) {
        setProfile(null);
        return;
      }

      setProfile(profileData);
    }

    load();
  }, [ready]);

  // ⭐ FIX: only redirect when hydration is complete AND user is truly missing
  if (ready && user === null) {
    window.location.href = "/reveal";
    return null;
  }

  if (!ready || !user || !profile) {
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
