import { randomBytes } from "node:crypto";

import { getPublicEnv } from "@/lib/env";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function generateOnboardingToken() {
  return randomBytes(24).toString("hex");
}

export function buildOnboardingUrl(token: string) {
  const env = getPublicEnv();

  return new URL(`/onboarding/${token}`, env.NEXT_PUBLIC_APP_URL).toString();
}
