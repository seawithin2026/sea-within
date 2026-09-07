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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/join");
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_member, membership_status, stripe_customer_id")
        .eq("id", user.id)
        .single();

      setProfile(profile);
      setLoading(false);
    }

    load();
  }, []);

  // ⭐ FIXED — Uses Supabase Edge Function instead of old Next.js route
  const handleManageSubscription = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/billing-portal`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    const { url } = await res.json();
    window.location.href = url;
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
