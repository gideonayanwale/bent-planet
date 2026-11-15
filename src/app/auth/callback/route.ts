import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAppRouteForEmail } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next");
  const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";
  const ts = requestUrl.searchParams.get("ts");

  // 1. Hardened 15-Minute Token Expiry Check
  if (ts) {
    const requestedAt = Number(ts);
    const fifteenMinutesMs = 15 * 60 * 1000;
    if (isNaN(requestedAt) || Date.now() - requestedAt > fifteenMinutesMs) {
      return NextResponse.redirect(
        new URL("/forgot-password?error=expired", requestUrl.origin)
      );
    }
  }

  // 2. PKCE Exchange
  if (code) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const destination = requestedNext ? next : data.user?.email ? getAppRouteForEmail(data.user.email) : next;
      return NextResponse.redirect(new URL(destination, requestUrl.origin));
    }
  }

  // Fallback to error
  return NextResponse.redirect(
    new URL("/forgot-password?error=invalid_token", requestUrl.origin)
  );
}
