// /api/profile/init/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

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
