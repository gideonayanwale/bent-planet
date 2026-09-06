import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";
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
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=auth_failed", requestUrl.origin)
  );
}
