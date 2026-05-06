import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

// ============================================
// SEA WITHIN — LIGHT MODERATION
// Allows emotional honesty.
// Blocks ONLY hate, violence, harassment.
// ============================================
function lightModeration(content: string) {
  if (!content || !content.trim()) {
    return {
      isApproved: false,
      suggestion: 'Share something real, even if it’s small.',
    };
  }

  const harmfulWords = [
    'kill',
    'hurt you',
    'hate you',
    'slur1',
    'slur2',
    'slur3'
  ];

  const lower = content.toLowerCase();
  const isHarmful = harmfulWords.some(word => lower.includes(word));

  if (isHarmful) {
    return {
      isApproved: false,
      suggestion:
        'This space welcomes honesty and depth. Only harmful or attacking language is not allowed.',
    };
  }

  return { isApproved: true };
}

// ============================================
// GET — Fetch wisdom posts or chat messages
// ============================================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'wisdom';
  const supabase = createServerSupabase();

  try {
    if (type === 'wisdom') {
      const { data, error } = await supabase
        .from('wisdom_posts')
        .select('id, content, created_at, profiles(full_name)')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const posts = (data || []).map((post: any) => ({
        id: post.id,
        content: post.content,
        author: post.profiles?.full_name || 'Anonymous Soul',
        created_at: post.created_at,
      }));

      return NextResponse.json({ posts });
    }

    // CHAT
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, message, created_at, user_id, profiles(full_name)')
      .eq('is_approved', true)
      .eq('room', 'general')
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;

    const messages = (data || []).map((msg: any) => ({
      id: msg.id,
      message: msg.message,
      author: msg.profiles?.full_name || 'Anonymous Soul',
      created_at: msg.created_at,
      user_id: msg.user_id,
    }));

    return NextResponse.json({ messages });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// ============================================
// POST — Create new wisdom post or chat message
// ============================================
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, type } = body;
  const supabase = createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Please sign in to share your light.' },
      { status: 401 }
    );
  }

  const moderation = lightModeration(content);
  if (!moderation.isApproved) {
    return NextResponse.json(
      {
        error: 'Message not approved',
        suggestion: moderation.suggestion,
      },
      { status: 422 }
    );
  }

  try {
    if (type === 'wisdom') {
      const { data, error } = await supabase
        .from('wisdom_posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          is_approved: true,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ post: data });
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        message: content.trim(),
        room: 'general',
        is_approved: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ chatMessage: data });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to save message' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT — Edit wisdom post
// ============================================
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, content, type } = body;

  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const table = type === 'wisdom' ? 'wisdom_posts' : 'chat_messages';

  const { data, error } = await supabase
    .from(table)
    .update({ content })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: data });
}

// ============================================
// DELETE — Delete wisdom post
// ============================================
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'wisdom';

  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const table = type === 'wisdom' ? 'wisdom_posts' : 'chat_messages';

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
