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
      // ⭐ FIX 1: use getSession instead of getUser
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        window.location.href = "/auth/signin";
        return;
      }

   
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, is_member, membership_status")
        .eq("id", user.id)
        .single();

      if (!profile) {
        window.location.href = "/auth/signin";
        return;
      }

      // ⭐ FIX 3: lowercase membership_status
      const status = profile.membership_status?.toLowerCase();

      // ⭐ FIX 2: membership guard FIRST
      const isActive =
        profile.is_member &&
        (status === "active" || status === "cancelling");

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
