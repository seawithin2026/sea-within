import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().split("T")[0];

  // 1. Check if today's affirmation already exists
  const { data: existing } = await supabase
    .from("daily_affirmations")
    .select("*")
    .eq("date", today)
    .single();

  if (existing) {
    return NextResponse.json({
      message: existing.message,
      attribution: existing.attribution,
    });
  }

  // 2. Get the next affirmation from the pool
  const { data: next } = await supabase
    .from("affirmation_pool")
    .select("*")
    .order("id", { ascending: true })
    .limit(1);

  if (!next || next.length === 0) {
    return NextResponse.json({
      message: "No affirmations available.",
      attribution: "System",
    });
  }

  const affirmation = next[0];

  // 3. Insert today's affirmation
  const { data: inserted } = await supabase
    .from("daily_affirmations")
    .insert({
      message: affirmation.message,
      attribution: affirmation.attribution,
      date: today,
    })
    .select()
    .single();

  // 4. Remove it from the pool
  await supabase.from("affirmation_pool").delete().eq("id", affirmation.id);

  return NextResponse.json({
    message: inserted.message,
    attribution: inserted.attribution,
  });
}
