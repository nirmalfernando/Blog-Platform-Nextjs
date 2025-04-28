import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const isAdmin = token?.role === "ADMIN";
  const isEditor = token?.role === "EDITOR";
  const isAuthorized = isAdmin || isEditor;

  // Protected API routes
  if (
    request.nextUrl.pathname.startsWith("/api/posts") &&
    request.method !== "GET"
  ) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Admin-only routes
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Comment routes - require authentication but any role can comment
  if (
    request.nextUrl.pathname.startsWith("/api/comments") &&
    request.method !== "GET"
  ) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/posts/:path*", "/api/comments/:path*", "/api/admin/:path*"],
};
