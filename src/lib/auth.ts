import { getServerEnv } from "@/lib/env";

export function isSuperAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  return email.toLowerCase() === getServerEnv().SUPER_ADMIN_EMAIL.toLowerCase();
}

export function getAppRouteForEmail(email?: string | null) {
  return isSuperAdminEmail(email) ? "/super-admin" : "/dashboard";
}

