import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { moderateContent } from '@/lib/moderation';

export async function GET() {
  const supabase = createServerSupabaseClient();
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
    username: m.profiles?.username || "Unknown",
    is_own: auth?.user?.id ? m.user_id === auth.user.id : false,
  }));

  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  const { content } = await req.json();

  const supabase = createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const moderation = moderateContent(content);
  if (!moderation.approved) {
    return NextResponse.json(
      { error: 'blocked', suggestion: moderation.message },
      { status: 400 }
    );
  }

  const { error } = await supabase.from('chat_messages').insert({
    user_id: auth.user.id,
    content,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
