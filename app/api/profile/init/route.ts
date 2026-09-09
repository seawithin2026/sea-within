import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST() {
  // Create Supabase server client with cookie support
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies }
  );

  // Get authenticated user from magic-link callback
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
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
    .maybeSingle();

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
