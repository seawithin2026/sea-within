import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';


/**
 * POST /api/auth/signup
 * Creates a new user account.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and name are required.' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (authError) {
      console.error('[Auth] Signup error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create profile (no tier)
    if (authData.user) {
      await supabase
        .from('profiles')
        .update({
          membership_tier: 'free', // optional, or remove entirely
        })
        .eq('id', authData.user.id);
    }

    return NextResponse.json({
      success: true,
      user: { id: authData.user?.id, email },
    });
  } catch (error) {
    console.error('[Auth] Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
