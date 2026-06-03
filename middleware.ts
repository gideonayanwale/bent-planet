import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getAppRouteForEmail, isSuperAdminEmail } from "@/lib/auth";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_API_ROUTES = new Set([
  "/api/subscribe",
  "/api/og",
  "/api/webhooks/resend",
  "/api/cron/email-sequences",
]);

function isDashboardRoute(pathname: string) {
  return pathname.startsWith("/dashboard");
}

function isSuperAdminRoute(pathname: string) {
  return pathname.startsWith("/super-admin");
}

function isProtectedApiRoute(pathname: string) {
  return pathname === "/api/generate-conference" || pathname === "/api/broadcast";
}

function isAlwaysPublicRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/onboarding/") ||
    pathname.startsWith("/c/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    PUBLIC_API_ROUTES.has(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAlwaysPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const { response, supabase } = await updateSession(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname === "/login") {
    if (!user) {
      return response;
    }

    return NextResponse.redirect(new URL(getAppRouteForEmail(user.email), request.url));
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isSuperAdminRoute(pathname)) {
    if (!isSuperAdminEmail(user.email)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  }

  if (isDashboardRoute(pathname) || isProtectedApiRoute(pathname)) {
    if (isSuperAdminEmail(user.email)) {
      if (isProtectedApiRoute(pathname)) {
        return NextResponse.json({ error: "Super admin cannot call church-only API routes." }, { status: 403 });
      }

      return NextResponse.redirect(new URL("/super-admin", request.url));
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
