import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { moderateContent } from '@/lib/moderation'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  const supabase = createServerSupabaseClient()

  if (type === 'wisdom') {
    const { data, error } = await supabase
      .from('wisdom_posts')
      .select('id, content, created_at, user_id, is_approved')   // ⭐ FIXED: REQUIRED FOR RLS
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const posts = (data || []).map((p: any) => ({
      id: p.id,
      content: p.content,
      created_at: p.created_at,
      author: 'Anonymous',
    }))

    return NextResponse.json({ posts })
  }

  if (type === 'journal') {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('id, content, created_at, user_id')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const posts = (data || []).map((p: any) => ({
      id: p.id,
      content: p.content,
      created_at: p.created_at,
      author: 'Anonymous',
    }))

    return NextResponse.json({ posts })
  }

  if (type === 'chat') {
    const { data: auth } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, content, created_at, user_id')
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const messages = (data || []).map((m: any) => ({
      id: m.id,
      message: m.content,
      created_at: m.created_at,
      author: 'A Beautiful Soul',
      is_own: auth?.user?.id ? m.user_id === auth.user.id : false,
    }))

    return NextResponse.json({ messages })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { content, type } = body

  const supabase = createServerSupabaseClient()
  const { data: auth } = await supabase.auth.getUser()

  if (!auth?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const moderation = moderateContent(content)
  if (!moderation.approved) {
    return NextResponse.json(
      {
        error: 'blocked',
        suggestion:
          moderation.message ||
          'This space is for uplifting, reflective, and supportive communication.',
      },
      { status: 400 }
    )
  }

  let table = ''
  let payload: any = {
    user_id: auth.user.id,
    is_approved: true,
  }

  if (type === 'wisdom') {
    table = 'wisdom_posts'
    payload.content = content
  }

  if (type === 'journal') {
    table = 'journal_entries'
    payload.content = content
  }

  if (type === 'chat') {
    table = 'chat_messages'
    payload.content = content
  }

  if (!table) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  const { error } = await supabase.from(table).insert(payload)

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        suggestion:
          'This space is for uplifting, reflective, and supportive communication.',
      },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { id, content, type } = body

  const supabase = createServerSupabaseClient()

  let table = ''
  if (type === 'wisdom') table = 'wisdom_posts'
  if (type === 'journal') table = 'journal_entries'

  if (!table) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  const { error } = await supabase
    .from(table)
    .update({ content })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const type = searchParams.get('type')

  const supabase = createServerSupabaseClient()

  let table = ''
  if (type === 'wisdom') table = 'wisdom_posts'
  if (type === 'journal') table = 'journal_entries'

  if (!table || !id) {
    return NextResponse.json({ error: 'Invalid type or id' }, { status: 400 })
  }

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
