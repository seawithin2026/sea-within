import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/auth/callback
 * Handles OAuth callback and email confirmation redirects.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/sanctuary";

  // ⭐ If no code → DO NOT REDIRECT to /signin
  // This prevents homepage redirect loops
  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const supabase = supabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (!error) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // ⭐ If exchange fails → send user to homepage instead of signin
  return NextResponse.redirect(`${origin}/`);
}
