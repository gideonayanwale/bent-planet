import { getServerEnv } from "@/lib/env";

export function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  const env = getServerEnv();
  const superAdmins = (env.SUPER_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return superAdmins.includes(email.toLowerCase());
}

export function getAppRouteForEmail(email?: string | null) {
  return isSuperAdmin(email) ? "/super-admin" : "/dashboard";
}
