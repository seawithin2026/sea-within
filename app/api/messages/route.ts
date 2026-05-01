import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { moderateContent } from '@/lib/moderation';

// ============================================
// SEA WITHIN — Messages API (Wisdom Board + Chat)
// ============================================
// All messages pass through the positive-vibe
// moderation filter before being saved.
// ============================================

// GET /api/messages?type=wisdom|chat
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
    } else {
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
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/messages — Create a new wisdom post or chat message
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, type } = body;
  const supabase = createServerSupabase();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Please sign in to share your light.' },
      { status: 401 }
    );
  }

  // ========================
  // MODERATION FILTER
  // ========================
  const moderation = moderateContent(content);

  if (!moderation.isApproved) {
    return NextResponse.json(
      {
        error: 'Message not approved',
        reason: moderation.reason,
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
          is_approved: true, // Pre-approved by moderation filter
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        message: 'Your wisdom has been shared.',
        post: data,
      });
    } else {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: content.trim(),
          room: 'general',
          is_approved: true, // Pre-approved by moderation filter
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        message: 'Message sent.',
        chatMessage: data,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to save message' },
      { status: 500 }
    );
  }
}
