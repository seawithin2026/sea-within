import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// GET — fetch posts/messages
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  const supabase = createServerSupabaseClient()

  let table = ''
  if (type === 'wisdom') table = 'wisdom_posts'
  if (type === 'journal') table = 'journal_entries'
  if (type === 'chat') table = 'community_messages'

  const { data, error } = await supabase
    .from(table)
    .select(`
      id,
      content,
      message,
      created_at,
      user:users(full_name)
    `)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Wisdom + Journal return "posts"
  if (type === 'wisdom' || type === 'journal') {
    const posts = data.map((p: any) => ({
      id: p.id,
      content: p.content,
      created_at: p.created_at,
      author: p.user?.full_name || 'Anonymous',
    }))
    return NextResponse.json({ posts })
  }

  // Community Chat returns "messages"
  if (type === 'chat') {
    const messages = data.map((m: any) => ({
      id: m.id,
      message: m.message || m.content,
      created_at: m.created_at,
      author: m.user?.full_name || 'Anonymous',
    }))
    return NextResponse.json({ messages })
  }
}

// POST — create new post/message
export async function POST(req: Request) {
  const body = await req.json()
  const { content, type } = body

  const supabase = createServerSupabaseClient()
  const { data: auth } = await supabase.auth.getUser()

  if (!auth?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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
    table = 'community_messages'
    payload.message = content
  }

  const { error } = await supabase.from(table).insert(payload)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

// PUT — edit wisdom/journal posts
export async function PUT(req: Request) {
  const body = await req.json()
  const { id, content, type } = body

  const supabase = createServerSupabaseClient()

  let table = ''
  if (type === 'wisdom') table = 'wisdom_posts'
  if (type === 'journal') table = 'journal_entries'

  const { error } = await supabase
    .from(table)
    .update({ content })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

// DELETE — delete wisdom/journal posts
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const type = searchParams.get('type')

  const supabase = createServerSupabaseClient()

  let table = ''
  if (type === 'wisdom') table = 'wisdom_posts'
  if (type === 'journal') table = 'journal_entries'

  const { error } = await supabase.from(table).delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
