import { redirect } from "next/navigation";

import { getAppRouteForEmail, isSuperAdminEmail } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAuthenticatedUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireSuperAdminUser() {
  const user = await requireAuthenticatedUser();

  if (!isSuperAdminEmail(user.email)) {
    redirect(getAppRouteForEmail(user.email));
  }

  return user;
}

export async function requireChurchUser() {
  const user = await requireAuthenticatedUser();

  if (isSuperAdminEmail(user.email)) {
    redirect("/super-admin");
  }

  return user;
}
