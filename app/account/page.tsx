"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      // ⭐ DO NOT REDIRECT HERE — this was the bug
      if (!user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_member, membership_status")
        .eq("id", user.id)
        .single();

      // ⭐ FINAL membership logic (matches webhook + SanctuaryLayout)
      const active =
        profile?.is_member === true &&
        (profile?.membership_status === "active" ||
         profile?.membership_status === "cancelling");

      setIsMember(active);
      setLoading(false);
    };

    load();
  }, []);

  const handleManageSubscription = () => {
    window.location.href =
      "https://billing.stripe.com/p/login/14AeVdcNK97p2OxcAuc3m00";
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/join");

  };

  // ⭐ Redirect ONLY after loading is complete
  if (!loading && !user) {
    router.push("/join");

    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[#E8D7B8]">Loading your account…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-transparent">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <h1 className="font-display text-2xl text-center text-[#E8D7B8] mb-6">
          Your Account
        </h1>

        <div className="space-y-6 text-[#E8D7B8]">
          <div>
            <p className="text-sm opacity-70">Email</p>
            <p className="text-lg">{user.email}</p>
          </div>

          <div>
            <p className="text-sm opacity-70">Membership Status</p>
            <p className="text-lg">
              {isMember ? "Active Member" : "Not a Member"}
            </p>
          </div>

          {isMember && (
            <button
              onClick={handleManageSubscription}
              className="w-full bg-gradient-to-br from-golden-400 to-golden-600 text-sanctuary-dark rounded-lg py-3 font-body text-sm tracking-[2px] uppercase"
            >
              Manage Subscription
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="w-full bg-white/20 text-[#E8D7B8] rounded-lg py-3 font-body text-sm tracking-[2px] uppercase border border-white/30"
          >
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
