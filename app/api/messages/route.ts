// /app/api/messages/route.ts

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { moderateContent } from '@/lib/moderation';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  const supabase = createServerSupabaseClient();

  //
  // ⭐ WISDOM BOARD — includes username
  //
  if (type === 'wisdom') {
    const { data, error } = await supabase
      .from('wisdom_posts')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles:profiles(username)
      `)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const posts = (data || []).map((p: any) => ({
      id: p.id,
      content: p.content,
      created_at: p.created_at,
      author: p.profiles?.username || "Unknown",
    }));

    return NextResponse.json({ posts });
  }

  //
  // ⭐ BLOOMING RITUAL
  //
  if (type === 'ritual') {
    const { data, error } = await supabase
      .from('ritual_entries') // ← your new table name
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles:profiles(username)
      `)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const posts = (data || []).map((p: any) => ({
      id: p.id,
      content: p.content,
      created_at: p.created_at,
      author: p.profiles?.username || "Unknown",
    }));

    return NextResponse.json({ posts });
  }

  //
  // ⭐ COMMUNITY CIRCLE CHAT — includes username
  //
  if (type === 'chat') {
    const { data: auth } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles:profiles(username)
      `)
      .order('created_at', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const messages = (data || []).map((m: any) => ({
      id: m.id,
      message: m.content,
      created_at: m.created_at,
      author: m.profiles?.username || "A Beautiful Soul",
      is_own: auth?.user?.id ? m.user_id === auth.user.id : false,
    }));

    return NextResponse.json({ messages });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}

//
// ⭐ POST — now supports wisdom, ritual, chat
//
export async function POST(req: Request) {
  const body = await req.json();
  const { content, type } = body;

  const supabase = createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const moderation = moderateContent(content);
  if (!moderation.approved) {
    return NextResponse.json(
      {
        error: 'blocked',
        suggestion:
          moderation.message ||
          'This space is for uplifting, reflective, and supportive communication.',
      },
      { status: 400 }
    );
  }

  let table = '';
  let payload: any = {
    user_id: auth.user.id,
    is_approved: true,
  };

  if (type === 'wisdom') {
    table = 'wisdom_posts';
    payload.content = content;

    // Dual-write to affirmation pool
    await supabase.from("affirmation_pool").insert({
      message: content,
      attribution: "Anonymous — Viewer Submission",
    });
  }

  if (type === 'ritual') {
    table = 'ritual_entries'; // ← new table
    payload.content = content;
  }

  if (type === 'chat') {
    table = 'chat_messages';
    payload.content = content;
  }

  if (!table) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const { error } = await supabase.from(table).insert(payload);

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        suggestion:
          'This space is for uplifting, reflective, and supportive communication.',
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

//
// ⭐ PUT — supports wisdom + ritual
//
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, content, type } = body;

  const supabase = createServerSupabaseClient();

  let table = '';
  if (type === 'wisdom') table = 'wisdom_posts';
  if (type === 'ritual') table = 'ritual_entries';

  if (!table) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const moderation = moderateContent(content);
  if (!moderation.approved) {
    return NextResponse.json(
      {
        error: 'blocked',
        suggestion:
          moderation.message ||
          'This space is for uplifting, reflective, and supportive communication.',
      },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from(table)
    .update({ content })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

//
// ⭐ DELETE — supports wisdom + ritual
//
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  const supabase = createServerSupabaseClient();

  let table = '';
  if (type === 'wisdom') table = 'wisdom_posts';
  if (type === 'ritual') table = 'ritual_entries';

  if (!table || !id) {
    return NextResponse.json({ error: 'Invalid type or id' }, { status: 400 });
  }

  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
