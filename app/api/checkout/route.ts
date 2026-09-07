export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!plan) {
      return NextResponse.json(
        { error: "Invalid or missing plan type." },
        { status: 400 }
      );
    }

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

    // ⭐ Call Supabase Edge Function instead of Stripe directly
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-checkout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await supabase.auth.getSession().then(r => r.data.session?.access_token)}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    return NextResponse.json({ url: data.url });
  } catch (error: any) {
    console.error("CHECKOUT ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
