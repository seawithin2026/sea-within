// supabase/functions/daily-affirmation/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import dayjs from "https://esm.sh/dayjs@1.11.10";
import utc from "https://esm.sh/dayjs@1.11.10/plugin/utc";
import timezone from "https://esm.sh/dayjs@1.11.10/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// ⭐ CORS HEADERS (used everywhere)
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://www.seawithinyourself.com",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // ⭐ Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: authData } = await supabase.auth.getUser(token);

    const user = authData?.user;
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("timezone")
      .eq("id", user.id)
      .single();

    const userTimezone = profile?.timezone || "UTC";

    const today = dayjs().tz(userTimezone).format("YYYY-MM-DD");
    const weekday = dayjs().tz(userTimezone).format("dddd");

    // ⭐ Check if today's affirmation already exists
    const { data: existing } = await supabase
      .from("daily_affirmations")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({
          message: existing.message,
          attribution: existing.attribution,
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // ⭐ FRIDAY WISDOM LOGIC
    if (weekday === "Friday") {
      const { data: wisdom } = await supabase
        .from("wisdom_posts")
        .select("*")
        .eq("is_approved", true)
        .is("featured_at", null)
        .order("created_at", { ascending: true })
        .limit(1);

      if (wisdom && wisdom.length > 0) {
        const post = wisdom[0];

        const { data: insertedWisdom } = await supabase
          .from("daily_affirmations")
          .insert({
            user_id: user.id,
            message: post.content,
            attribution: post.username || "Community Member",
            date: today,
          })
          .select()
          .maybeSingle();

        await supabase
          .from("wisdom_posts")
          .update({ featured_at: today })
          .eq("id", post.id);

        return new Response(
          JSON.stringify({
            message: insertedWisdom.message,
            attribution: insertedWisdom.attribution,
          }),
          { status: 200, headers: corsHeaders }
        );
      }
    }

    // ⭐ DAILY AFFIRMATION LOGIC
    let { data: pool } = await supabase
      .from("affirmation_pool")
      .select("*")
      .order("id", { ascending: true });

    if (!pool || pool.length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "Affirmation pool is empty. Please refill it from your curated pool.",
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    const affirmation = pool[0];

    const { data: inserted } = await supabase
      .from("daily_affirmations")
      .insert({
        user_id: user.id,
        message: affirmation.message,
        attribution: affirmation.attribution,
        date: today,
      })
      .select()
      .maybeSingle();

    await supabase.from("affirmation_pool").delete().eq("id", affirmation.id);

    return new Response(
      JSON.stringify({
        message: inserted.message,
        attribution: inserted.attribution,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Affirmation error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
