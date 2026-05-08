import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/emails/sender';

/**
 * POST /api/auth/signup
 * Creates a new user account and sends the automated welcome email.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, tier } = body;

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

    // Update profile with membership tier
    if (authData.user) {
      await supabase
        .from('profiles')
        .update({ membership_tier: tier?.toLowerCase() || 'free' })
        .eq('id', authData.user.id);
    }

    // Send automated welcome email
    await sendWelcomeEmail(email, fullName);

    // Log the email
    await supabase.from('email_log').insert({
      user_id: authData.user?.id,
      email_type: 'welcome',
      to_email: email,
      subject: 'Welcome to Sea Within',
      status: 'sent',
    });

    // If paid tier, record in tax tracking
    if (tier && tier !== 'Explorer') {
      const amount = tier === 'Guardian' ? 44.00 : 22.00;
      await supabase.from('tax_records').insert({
        category: 'membership_revenue',
        amount,
        currency: 'CAD',
        description: `New ${tier} membership — ${fullName}`,
        is_revenue: true,
        tax_year: new Date().getFullYear(),
        tax_month: new Date().getMonth() + 1,
      });
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
