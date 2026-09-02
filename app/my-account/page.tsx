"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Navigation from "@/components/layout/Navigation";

export default function MyAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/join");
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_member, membership_status")
        .eq("id", user.id)
        .single();

      setProfile(profile);
      setLoading(false);
    }

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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[#E8D7B8]">Loading your account…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sanctuary-dark">
      <Navigation />

      <div className="max-w-md mx-auto px-6 pt-32 pb-24">
        <div className="sanctuary-card p-8 md:p-12">

          <h1 className="font-display text-3xl text-center text-sea-100 mb-8">
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
                {profile?.is_member ? "Active Member" : "Not a Member"}
              </p>
            </div>

            {profile?.is_member && (
              <button
                onClick={handleManageSubscription}
                className="btn-golden w-full py-3 text-[12px] tracking-[2px]"
              >
                Manage Subscription
              </button>
            )}

            <button
              onClick={handleSignOut}
              className="btn-ghost w-full py-3 text-[12px] tracking-[2px]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
