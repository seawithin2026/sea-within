import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Your Supabase version uses the normal client for reset emails
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Generate Supabase reset email with redirect
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://www.seawithinyourself.com/reset-password",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send your custom email via Resend
    await resend.emails.send({
      from: "Sea Within <support@seawithinyourself.com>",
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello,</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="https://www.seawithinyourself.com/reset-password">Reset Password</a></p>
      `,
    });

    return NextResponse.json({ message: "Password reset email sent" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
