"use client";

import { supabase } from "@/lib/supabase/client";

export default function FixMembership() {
  async function fix() {
    const { data, error } = await supabase.auth.updateUser({
      data: { is_member: true }
    });

    console.log("Updated:", data, error);
  }

  return (
    <button onClick={fix}>
      Fix My Membership
    </button>
  );
}
