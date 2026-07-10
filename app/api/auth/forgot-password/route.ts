import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // ⭐ HARD-CODED REDIRECT — REQUIRED FOR NEW SUPABASE VERSION
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://www.seawithinyourself.com/reset-password",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Password reset email sent" });
}
