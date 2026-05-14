import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import affirmations from "@/data/affirmations";

export async function GET() {
 const supabase = createServerSupabaseClient();
  const today = new Date().toISOString().split("T")[0];

  // 1. Check if today's affirmation already exists
  const { data: existing } = await supabase
    .from("daily_affirmations")
    .select("*")
    .eq("date", today)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({
      message: existing.message,
      attribution: existing.attribution,
    });
  }

// 2. Pull the next affirmation from the pool
let { data: pool, error: poolError } = await supabase
  .from("affirmation_pool")
  .select("*")
  .order("id", { ascending: true });

  // 3. If pool is empty → refill from backup file
  if (!pool || pool.length === 0) {
    await supabase.from("affirmation_pool").insert(affirmations);

    const refreshed = await supabase
      .from("affirmation_pool")
      .select("*")
      .order("id", { ascending: true });

    pool = refreshed.data || [];
  }

  // 4. Select the first affirmation in the pool
  const affirmation = pool[0];

  // 5. Insert today's affirmation
  const { data: inserted } = await supabase
    .from("daily_affirmations")
    .insert({
      message: affirmation.message,
      attribution: affirmation.attribution,
      date: today,
    })
    .select()
    .maybeSingle();

  // 6. Remove it from the pool
  await supabase.from("affirmation_pool").delete().eq("id", affirmation.id);

  // 7. Return the final message
  return NextResponse.json({
    message: inserted.message,
    attribution: inserted.attribution,
  });
}
