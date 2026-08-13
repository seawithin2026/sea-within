import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { moderateContent } from "@/lib/moderation";

//
// ⭐ GET — return wisdom posts with username, country, date
//
export async function GET() {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("wisdom_posts")
    .select(`
      id,
      content,
      created_at,
      user_id,
      username,
      country
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

 const posts = (data || []).map((p: any) => ({
  id: p.id,
  content: p.content,
  created_at: p.created_at,
  username: p.username || "Unknown",
  country: p.country || "Unknown",
}));

  return NextResponse.json({ posts });
}

//
// ⭐ POST — insert wisdom post with username, country, date
//
export async function POST(req: Request) {
  const { content } = await req.json();

  const supabase = createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // ⭐ Fetch username + country from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, country")
    .eq("id", auth.user.id)
    .single();

  const moderation = moderateContent(content);
  if (!moderation.approved) {
    return NextResponse.json(
      {
        error: "blocked",
        suggestion:
          moderation.message ||
          "This space is for uplifting, reflective, and supportive communication.",
      },
      { status: 400 }
    );
  }

  // ⭐ Dual-write to affirmation pool
  await supabase.from("affirmation_pool").insert({
    message: content,
    attribution: "Anonymous — Viewer Submission",
  });

  // ⭐ Insert wisdom post with metadata
  const { error } = await supabase.from("wisdom_posts").insert({
    user_id: auth.user.id,
    content,
    username: profile?.username || null,
    country: profile?.country || null,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        suggestion:
          "This space is for uplifting, reflective, and supportive communication.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

//
// ⭐ PUT — update wisdom post
//
export async function PUT(req: Request) {
  const { id, content } = await req.json();

  const supabase = createServerSupabaseClient();

  const moderation = moderateContent(content);
  if (!moderation.approved) {
    return NextResponse.json(
      {
        error: "blocked",
        suggestion:
          moderation.message ||
          "This space is for uplifting, reflective, and supportive communication.",
      },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("wisdom_posts")
    .update({ content })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

//
// ⭐ DELETE — delete wisdom post
//
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from("wisdom_posts")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
