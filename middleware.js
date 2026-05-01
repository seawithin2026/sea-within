import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;

  // Allow access ONLY to login + signup pages
  if (
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/signup")
  ) {
    return NextResponse.next();
  }

  // Block everything else
  return NextResponse.redirect(new URL("/login", req.url));
}
