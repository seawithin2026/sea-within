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

    // ADMIN client (service role)
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // IMPORTANT
      {
        cookies: {
          get() {
            return "";
          },
          set() {},
          remove() {}
        }
      }
    );

    // Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
      });

    if (authError) {
      console.error("[Auth] Signup error:", authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create profile
    if (authData.user) {
      await supabaseAdmin
        .from("profiles")
        .update({
          membership_tier: "free"
        })
        .eq("id", authData.user.id);

      // Sync membership from pending Stripe customer
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/sync-membership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          userId: authData.user.id
        })
      });
    }

    return NextResponse.json({
      success: true,
      user: { id: authData.user?.id, email }
    });
  } catch (error) {
    console.error("[Auth] Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
