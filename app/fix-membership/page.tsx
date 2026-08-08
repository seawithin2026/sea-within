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
    <div className="relative z-[999999] p-10 bg-red-500 pointer-events-auto">
      <h1 className="text-4xl">Fix Membership</h1>

      <button
        onClick={fix}
        className="mt-6 px-10 py-5 text-2xl bg-black text-white rounded-xl"
      >
        Fix My Membership
      </button>
    </div>
  );
}
