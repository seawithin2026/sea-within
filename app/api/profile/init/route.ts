import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST() {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Check if profile exists
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Create profile if missing
  if (!existing) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      is_member: false,
      membership_status: "none",
    });
  }

  return NextResponse.json({ ok: true });
}
