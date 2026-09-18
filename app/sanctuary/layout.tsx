"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import UsernameModal from "@/components/UsernameModal";
import ScrollDownArrow from "@/components/ScrollDownArrow";
import "../globals.css";

export default function SanctuaryLayout({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        window.location.href = "/reveal";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, is_member, membership_status")
        .eq("id", user.id)
        .single();

      if (!profile) {
        window.location.href = "/reveal";
        return;
      }

      const status = profile.membership_status?.toLowerCase();

      const isActive =
        profile.is_member === true &&
        (status === "active" || status === "cancelling");

      if (!isActive) {
        window.location.href = "/reveal";
        return;
      }

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

      {/* 🌟 Soft gold scroll-down cue */}
      <ScrollDownArrow />

      {children}
    </>
  );
}
