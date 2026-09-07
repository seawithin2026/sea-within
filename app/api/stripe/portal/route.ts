import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST() {
  const supabase = supabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Call Supabase Edge Function
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/billing-portal`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data.error }, { status: 500 });
  }

  return NextResponse.json({ url: data.url });
}
