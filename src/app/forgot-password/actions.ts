"use server";

import { headers } from "next/headers";
import {
  actionError,
  actionSuccess,
  forgotPasswordSchema,
  fromValidationError,
  getFormValue,
  type ActionState,
} from "@/lib/forms";
import { checkRateLimit } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function forgotPasswordAction(formData: FormData): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: getFormValue(formData, "email"),
  });

  if (!parsed.success) {
    return fromValidationError(parsed.error);
  }

  const email = parsed.data.email.trim().toLowerCase();

  // Extract client IP address from request headers
  const headerStore = headers();
  const clientIp =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "127.0.0.1";

  // Check 15-minute rate limit for both Email and Client IP
  const emailLimit = await checkRateLimit(email, "password_reset");
  if (!emailLimit.allowed) {
    return actionError(emailLimit.error || "Too many password reset requests. Please wait 15 minutes.");
  }

  const ipLimit = await checkRateLimit(clientIp, "password_reset_ip");
  if (!ipLimit.allowed) {
    return actionError("Too many password reset requests from your IP. Please wait 15 minutes.");
  }

  // Construct absolute redirect URL for callback with 15-minute verification timestamp
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bentplanet.com";
  const nowTs = Date.now();
  const redirectTo = `${appUrl}/auth/callback?next=/reset-password&ts=${nowTs}`;

  try {
    const supabase = createServerSupabaseClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
  } catch (err) {
    console.error("Supabase password reset error:", err);
  }

  // ANTI-ENUMERATION SECURITY: Always return consistent success message
  return actionSuccess(
    "If an account with that email exists, we have sent a 15-minute password reset link to your inbox."
  );
}
