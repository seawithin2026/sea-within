import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();

    // ⭐ Correct body parsing (only once)
    const { bloomVideoId, level, stillUrl, element } = await req.json();

    if (!bloomVideoId || typeof level !== "number") {
      return NextResponse.json(
        { error: "Missing bloomVideoId or level" },
        { status: 400 }
      );
    }

    // ⭐ Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // ⭐ Insert bloom instance with elemental identity
    const { data, error } = await supabase
      .from("bloom_instances")
      .insert({
        user_id: user.id,
        bloom_video_id: bloomVideoId,
        level,
        still_url: stillUrl,
        element, // ⭐ NEW FIELD
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        bloom: data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Bloom save error:", err);
    return NextResponse.json(
      { error: "Internal error saving bloom" },
      { status: 500 }
    );
  }
}
