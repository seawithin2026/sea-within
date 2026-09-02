import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 });

  await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
