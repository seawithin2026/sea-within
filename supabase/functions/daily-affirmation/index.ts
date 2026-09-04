// supabase/functions/daily-affirmation/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import dayjs from "https://esm.sh/dayjs@1.11.10";
import utc from "https://esm.sh/dayjs@1.11.10/plugin/utc";
import timezone from "https://esm.sh/dayjs@1.11.10/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// Load your affirmation pool backup
import affirmations from "./affirmations.json" assert { type: "json" };

serve(async (req) => {
  try {
    // 1. Init Supabase client (service role is allowed here)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 2. Get user from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: authData } = await supabase.auth.getUser(token);

    const user = authData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    // 3. Fetch timezone
    const { data: profile } = await supabase
      .from("profiles")
      .select("timezone")
      .eq("id", user.id)
      .single();

    const userTimezone = profile?.timezone || "UTC";

    // 4. Compute today's date in user's timezone
    const today = dayjs().tz(userTimezone).format("YYYY-MM-DD");

    // 5. Check if today's affirmation already exists
    const { data: existing } = await supabase
      .from("daily_affirmations")
      .select("*")
      .eq("date", today)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({
          message: existing.message,
          attribution: existing.attribution,
        }),
        { status: 200 }
      );
    }

    // 6. Pull next affirmation from pool
    let { data: pool } = await supabase
      .from("affirmation_pool")
      .select("*")
      .order("id", { ascending: true });

    // 7. Refill pool if empty
    if (!pool || pool.length === 0) {
      await supabase.from("affirmation_pool").insert(affirmations);

      const refreshed = await supabase
        .from("affirmation_pool")
        .select("*")
        .order("id", { ascending: true });

      pool = refreshed.data || [];
    }

    // 8. Select first affirmation
    const affirmation = pool[0];

    // 9. Insert today's affirmation
    const { data: inserted } = await supabase
      .from("daily_affirmations")
      .insert({
        message: affirmation.message,
        attribution: affirmation.attribution,
        date: today,
      })
      .select()
      .maybeSingle();

    // 10. Remove from pool
    await supabase.from("affirmation_pool").delete().eq("id", affirmation.id);

    return new Response(
      JSON.stringify({
        message: inserted.message,
        attribution: inserted.attribution,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Affirmation error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
});
