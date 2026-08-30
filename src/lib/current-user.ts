import { redirect } from "next/navigation";

import { getAppRouteForEmail, isSuperAdmin } from "@/lib/auth";
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

  if (!isSuperAdmin(user.email)) {
    redirect(getAppRouteForEmail(user.email));
  }

  return user;
}

export async function requireChurchUser() {
  const user = await requireAuthenticatedUser();

  if (isSuperAdmin(user.email)) {
    const { cookies } = require("next/headers");
    const cookieStore = cookies();
    const impersonateEmail = cookieStore.get("impersonate_church_email")?.value;

    if (impersonateEmail) {
      return {
        ...user,
        email: impersonateEmail,
        isImpersonating: true,
      };
    }
    redirect("/super-admin");
  }

  return {
    ...user,
    isImpersonating: false,
  };
}
