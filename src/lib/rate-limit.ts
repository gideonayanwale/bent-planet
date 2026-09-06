import { createAdminClient } from "@/lib/supabase/admin";

export const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
export const MAX_PASSWORD_RESET_ATTEMPTS = 3;

// In-memory sliding window cache fallback
const inMemoryRateLimits = new Map<string, number[]>();

export type RateLimitResult = {
  allowed: boolean;
  remainingAttempts: number;
  resetMinutes: number;
  error?: string;
};

/**
 * Checks and records rate limits for auth actions (e.g. password resets).
 * Enforces 15-minute sliding window limit.
 */
export async function checkRateLimit(
  identifier: string,
  action: string = "password_reset",
  windowMs: number = FIFTEEN_MINUTES_MS,
  maxAttempts: number = MAX_PASSWORD_RESET_ATTEMPTS
): Promise<RateLimitResult> {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const key = `${action}:${normalizedIdentifier}`;
  const now = Date.now();
  const windowStart = new Date(now - windowMs).toISOString();

  let attemptsCount = 0;
  let dbSuccess = false;

  try {
    const adminClient = createAdminClient();

    // Query attempts within window
    const { count, error } = await adminClient
      .from("auth_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("identifier", normalizedIdentifier)
      .eq("action", action)
      .gte("requested_at", windowStart);

    if (!error && typeof count === "number") {
      attemptsCount = count;
      dbSuccess = true;
    }
  } catch (err) {
    console.warn("DB Rate limit check fallback to memory:", err);
  }

  // Fallback to in-memory sliding window if DB query was unavailable
  if (!dbSuccess) {
    const timestamps = (inMemoryRateLimits.get(key) || []).filter(
      (ts) => now - ts < windowMs
    );
    attemptsCount = timestamps.length;
    inMemoryRateLimits.set(key, timestamps);
  }

  if (attemptsCount >= maxAttempts) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetMinutes: Math.ceil(windowMs / (60 * 1000)),
      error: `Too many password reset attempts. Please wait 15 minutes before trying again.`,
    };
  }

  // Record attempt
  try {
    const adminClient = createAdminClient();
    await adminClient.from("auth_rate_limits").insert({
      identifier: normalizedIdentifier,
      action: action,
      requested_at: new Date().toISOString(),
    });
  } catch {
    const existing = inMemoryRateLimits.get(key) || [];
    existing.push(now);
    inMemoryRateLimits.set(key, existing);
  }

  return {
    allowed: true,
    remainingAttempts: Math.max(0, maxAttempts - (attemptsCount + 1)),
    resetMinutes: Math.ceil(windowMs / (60 * 1000)),
  };
}
