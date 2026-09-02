import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Email, password, and name are required." },
        { status: 400 }
      );
    }

    // Admin client (safe ONLY on server)
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get() { return ""; },
          set() {},
          remove() {}
        }
      }
    );

    // Create user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create profile WITHOUT touching membership fields
    if (authData.user) {
      await supabaseAdmin
        .from("profiles")
        .upsert({
          id: authData.user.id,
          email,
          full_name: fullName,
          stripe_customer_id: null,   // webhook will fill this
          stripe_subscription_id: null,
          membership_status: "free",  // safe default
          is_member: false,
          access_until: null
        });
    }

    return NextResponse.json({
      success: true,
      user: { id: authData.user?.id, email }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
