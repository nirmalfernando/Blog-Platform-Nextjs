import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const isAdmin = token?.role === "ADMIN";
  const isEditor = token?.role === "ADMIN" || token?.role === "EDITOR";

  // Protected routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL("/login?callbackUrl=/admin", request.url)
      );
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/editor")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL("/login?callbackUrl=/editor", request.url)
      );
    }

    if (!isEditor) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/profile")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL("/login?callbackUrl=/profile", request.url)
      );
    }
  }

  // Protected API routes
  if (
    request.nextUrl.pathname.startsWith("/api/posts") &&
    request.method !== "GET"
  ) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isEditor) {
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
  matcher: [
    "/admin/:path*",
    "/editor/:path*",
    "/profile/:path*",
    "/api/posts/:path*",
    "/api/comments/:path*",
    "/api/admin/:path*",
  ],
};
