"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import UsernameModal from "@/components/UsernameModal";

export default function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUsername() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (!profile?.username) {
        setShowModal(true);
      }

      setLoading(false);
    }

    checkUsername();
  }, []);

  if (loading) return null;

  return (
    <>
      {showModal && (
        <UsernameModal onComplete={() => setShowModal(false)} />
      )}

      {children}
    </>
  );
}
