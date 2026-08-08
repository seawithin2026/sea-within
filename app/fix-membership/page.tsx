"use client";

import { supabase } from "@/lib/supabase/client";

export default function FixMembership() {
  async function fix() {
    await supabase.auth.updateUser({
      data: { is_member: true }
    });
  
  }



  return (
    <div
      style={{
        background: "red",
        padding: 50,
        zIndex: 999999,
        position: "relative",
      }}
    >
      <h1 style={{ fontSize: 50 }}>FIX MEMBERSHIP PAGE</h1>

      <button
        onClick={fix}
        style={{
          fontSize: 30,
          padding: "20px 40px",
          background: "black",
          color: "white",
          borderRadius: 12,
          marginTop: 20,
        }}
      >
        Fix My Membership
      </button>
    </div>
  );
}
