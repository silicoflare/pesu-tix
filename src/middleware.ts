import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (req.nextUrl.pathname.startsWith("/redirect")) {
    if (token) {
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/clubs", req.url));
      } else if (token.role === "CLUB") {
        return NextResponse.redirect(new URL("/events", req.url));
      }
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
