"use server";

import { redirect } from "next/navigation";

import { getAppRouteForEmail } from "@/lib/auth";
import {
  actionError,
  fromValidationError,
  getFormValue,
  loginSchema,
  type ActionState,
} from "@/lib/forms";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData): Promise<ActionState | void> {
  const parsed = loginSchema.safeParse({
    email: getFormValue(formData, "email"),
    password: getFormValue(formData, "password"),
  });

  if (!parsed.success) {
    return fromValidationError(parsed.error);
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user?.email) {
    return actionError("The email or password you entered is incorrect.");
  }

  redirect(getAppRouteForEmail(data.user.email));
}
