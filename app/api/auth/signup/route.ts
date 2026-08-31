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

  
    if (authData.user) {
      await supabaseAdmin
        .from("profiles")
        .update({
          membership_status: "free",
          is_member: false
        })
        .eq("id", authData.user.id);
   
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
