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

      if (!user) {
        router.push("/signin");
        return;
      }

      setUser(user);

      // ⭐ UPDATED: use membership_status instead of is_member
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership_status")
        .eq("id", user.id)
        .single();

      const status = profile?.membership_status;

      // ⭐ Active OR cancel_at_period_end = still a member
      setIsMember(
  status === "active" ||
  status === "cancel_at_period_end" ||
  status === "trialing" ||
  status === "past_due" ||
  status === "cancelling"
);


      setLoading(false);
    };

    load();
  }, []);

  /* -----------------------------------------------------
     ⭐ FIXED MANAGE SUBSCRIPTION FUNCTION
  ----------------------------------------------------- */
  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "GET",
      });

      const data = await response.json();

      console.log("Portal response:", data);

      if (!data.url) {
        alert("Could not open subscription portal.");
        return;
      }

      window.location.href = data.url;

    } catch (error) {
      console.error("Error opening portal:", error);
      alert("Something went wrong.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
  };

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
