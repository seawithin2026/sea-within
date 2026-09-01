"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import UsernameModal from "@/components/UsernameModal";
import "../globals.css";

export default function SanctuaryLayout({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      // Get session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      // ⭐ FIX: Non‑signed‑in users go to REVEAL (not sign‑in)
      if (!user) {
        window.location.href = "/reveal";
        return;
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, is_member, membership_status")
        .eq("id", user.id)
        .single();

      // If no profile, treat as non‑member → reveal
      if (!profile) {
        window.location.href = "/reveal";
        return;
      }

      // ⭐ Membership guard FIRST
      const status = profile.membership_status?.toLowerCase();

      
      const isActive =
        profile.is_member &&
        (status === "active" || status === "cancelling");

      // ⭐ Non‑members → reveal
      if (!isActive) {
        window.location.href = "/reveal";
        return;
      }

      // ⭐ Username check AFTER membership
      if (!profile.username) {
        setShowModal(true);
      }

      setAllowed(true);
      setLoading(false);
    }

    checkAccess();
  }, []);

  if (loading) return null;
  if (!allowed) return null;

  return (
    <>
      {showModal && (
        <UsernameModal onComplete={() => setShowModal(false)} />
      )}

      {children}
    </>
  );
}
