"use server";

import {
  actionError,
  fromValidationError,
  getFormValue,
  resetPasswordSchema,
  type ActionState,
} from "@/lib/forms";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function resetPasswordAction(formData: FormData): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: getFormValue(formData, "password"),
    confirmPassword: getFormValue(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return fromValidationError(parsed.error);
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return actionError(error.message || "Failed to update password. Your reset session may have expired.");
  }

  return {
    status: "success",
    payload: "/login?reset=success",
  };
}
