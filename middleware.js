import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();

  // Attach Supabase session cookies to the request
  const supabase = createMiddlewareClient({ req, res });

  // This ensures the server can see your session
  await supabase.auth.getSession();

  return res;
}
