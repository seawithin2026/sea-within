import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

// ============================================
// SEA WITHIN — Auth API Routes
// ============================================

// POST /api/auth — Sign up or Login
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, fullName } = body;
  const supabase = createServerSupabase();

  // Determine if this is signup or login
  const isSignup = !!fullName;

  try {
    if (isSignup) {
      // --- SIGN UP ---
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Create profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          membership_tier: 'free',
        });

        // Send welcome email (non-blocking)
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/emails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'welcome',
            to: email,
            name: fullName,
          }),
        }).catch(() => {});
      }

      return NextResponse.json({
        message: 'Account created. Please check your email to confirm.',
        user: data.user,
      });
    } else {
      // --- LOGIN ---
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      return NextResponse.json({
        message: 'Welcome back.',
        user: data.user,
        session: data.session,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
