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

      if (!user) {
        window.location.href = "/reveal";
        return;
      }

      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, membership_status")
        .eq("id", user.id)
        .maybeSingle();

      if (!profileData) {
        window.location.href = "/reveal";
        return;
      }

      setProfile(profileData);
    }

    load();
  }, [ready]);

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
