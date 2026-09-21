"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Navigation from "@/components/layout/Navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/40 tracking-[3px] uppercase">
          Loading Profile...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="max-w-xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-light mb-6">Your Profile</h1>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-white/70 mb-2">
            <strong>Name:</strong> {profile.username || "No name yet"}
          </p>
          <p className="text-white/70 mb-2">
            <strong>Email:</strong> {profile.email}
          </p>
          <p className="text-white/70 mb-2">
            <strong>Timezone:</strong> {profile.timezone}
          </p>
          <p className="text-white/70 mb-2">
            <strong>Membership:</strong>{" "}
            {profile.membership_status || "none"}
          </p>
        </div>
      </div>
    </main>
  );
}
