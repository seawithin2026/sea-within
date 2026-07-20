import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  const supabase = createAdminClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://www.seawithinyourself.com/reset-password",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "ok" });
}
