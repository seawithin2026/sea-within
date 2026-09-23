"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AccountPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
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
          Loading Account...
        </p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>No profile found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-light mb-10 tracking-wide">
        Your Sea Within Membership
      </h1>

      <div className="space-y-6 max-w-xl">
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-light mb-3">Membership Status</h2>
          <p className="text-slate-300 text-lg">
            {profile.membership_status === "active" && "Active"}
            {profile.membership_status === "cancelling" && "Cancelling"}
            {profile.membership_status === "cancel_at_period_end" && "Ending Soon"}
            {profile.membership_status === "none" && "Not a Member"}
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-light mb-3">Your Plan</h2>
          <p className="text-slate-300 text-lg">Sea Within Gold 400</p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-light mb-3">Account Email</h2>
          <p className="text-slate-300 text-lg">{profile.email}</p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-light mb-3">Username</h2>
          <p className="text-slate-300 text-lg">{profile.username}</p>
        </div>

        <button
          onClick={async () => {
            const res = await fetch("/api/billing-portal", { method: "POST" });
            const { url } = await res.json();
            window.location.href = url;
          }}
          className="mt-10 px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition"
        >
          Manage Subscription
        </button>
      </div>
    </main>
  );
}
