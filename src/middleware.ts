import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Checks whether any Better Auth session cookie is present on the incoming request.
 * Matches `better-auth.session_token`, `__Secure-better-auth.session_token`, etc.
 */
function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some((c) => c.name.includes("session_token") && Boolean(c.value));
}

function redirectToLogin(
  request: NextRequest,
  options: { callbackUrl?: string; error?: "unauthorized" | "forbidden" } = {}
) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set(
    "callbackUrl",
    options.callbackUrl ?? `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  if (options.error) url.searchParams.set("error", options.error);

  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Legacy admin login route redirects to /login
  if (pathname === "/admin/login") {
    return redirectToLogin(request, { callbackUrl: "/admin" });
  }

  const hasCookie = hasSessionCookie(request);

  // Guest order lookup by phone/code must remain reachable after a booking.
  if (pathname === "/my-bookings" || pathname.startsWith("/my-bookings/")) {
    const isGuestLookup = searchParams.has("code") || searchParams.has("phone");
    if (!hasCookie && !isGuestLookup) {
      return redirectToLogin(request, { error: "unauthorized" });
    }
    return NextResponse.next();
  }

  // Admin routes:
  // - If user has no session cookie at all, redirect to /login immediately.
  // - If user has session cookie, allow access to /admin.
  // Real authorization & role validation is strictly enforced on the page and backend tRPC procedures.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!hasCookie) {
      return redirectToLogin(request, { error: "unauthorized" });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Only the routes that need authorization checks.
  matcher: ["/admin/:path*", "/my-bookings/:path*"],
};
