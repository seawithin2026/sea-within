import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: req.cookies }
  );

  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: [
    "/((?!api/webhooks/stripe).*)",
  ],
};
