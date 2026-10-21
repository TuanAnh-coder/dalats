import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Check for better-auth session cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isLoginPage = pathname === "/admin/login";

  // Case 1: No session token
  if (!sessionToken) {
    if (isLoginPage) {
      return NextResponse.next();
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Session token exists -> verify role with better-auth session endpoint
  try {
    const origin = request.nextUrl.origin;
    const sessionRes = await fetch(`${origin}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!sessionRes.ok) {
      if (isLoginPage) return NextResponse.next();
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const sessionData = await sessionRes.json();
    const userRole = sessionData?.user?.role;

    // If logged in as admin and trying to visit login page -> redirect to admin dashboard
    if (isLoginPage && userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // If visiting protected admin pages but not an admin -> redirect to login with error
    if (!isLoginPage && userRole !== "admin") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "forbidden");
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.warn("Middleware auth check fallback:", error);
    // On unexpected fetch failure, allow login page, or require re-auth
    if (!isLoginPage && !sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
