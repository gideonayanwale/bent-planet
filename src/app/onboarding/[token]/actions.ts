"use server";

import { revalidatePath } from "next/cache";

import { upsertChurchAuthUser } from "@/lib/auth-users";
import { getChurchByAdminEmail, generateUniqueChurchSlug } from "@/lib/churches";
import {
  actionError,
  fromValidationError,
  getFormValue,
  onboardingSchema,
  type ActionState,
  validateLogoFile,
  isUploadedFile,
} from "@/lib/forms";
import { normalizeEmail } from "@/lib/invites";
import { uploadChurchLogo } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function completeOnboardingAction(formData: FormData): Promise<ActionState | void> {
  const parsed = onboardingSchema.safeParse({
    token: getFormValue(formData, "token"),
    churchName: getFormValue(formData, "churchName"),
    adminName: getFormValue(formData, "adminName"),
    password: getFormValue(formData, "password"),
    confirmPassword: getFormValue(formData, "confirmPassword"),
    country: getFormValue(formData, "country"),
    timezone: getFormValue(formData, "timezone"),
    bio: getFormValue(formData, "bio"),
    instagramUrl: getFormValue(formData, "instagramUrl"),
    facebookUrl: getFormValue(formData, "facebookUrl"),
    youtubeUrl: getFormValue(formData, "youtubeUrl"),
    whatsappUrl: getFormValue(formData, "whatsappUrl"),
  });

  if (!parsed.success) {
    return fromValidationError(parsed.error);
  }

  const logoEntry = formData.get("logo");
  const logoError = validateLogoFile(logoEntry);

  if (logoError) {
    return actionError(logoError, { logo: [logoError] });
  }

  if (!isUploadedFile(logoEntry)) {
    return actionError("Upload a church logo.", { logo: ["Upload a church logo."] });
  }

  const adminClient = createAdminClient();

  try {
    const { data: invite, error: inviteLookupError } = await adminClient
      .from("invites")
      .select("*")
      .eq("token", parsed.data.token)
      .maybeSingle();

    if (inviteLookupError) {
      throw new Error(inviteLookupError.message);
    }

    if (!invite || invite.status !== "pending" || !invite.email) {
      return actionError("This onboarding link is invalid or has already been used.");
    }

    const adminEmail = normalizeEmail(invite.email);
    const church = await getChurchByAdminEmail(adminClient, adminEmail);

    if (
      !church ||
      church.onboarding_completed ||
      church.onboarding_token !== parsed.data.token
    ) {
      return actionError("This onboarding link is invalid or has already been used.");
    }

    const slug = await generateUniqueChurchSlug(adminClient, parsed.data.churchName, church.id);
    const logoUrl = await uploadChurchLogo(adminClient, church.id, logoEntry);

    await upsertChurchAuthUser(adminClient, {
      email: adminEmail,
      password: parsed.data.password,
      adminName: parsed.data.adminName,
      churchName: parsed.data.churchName,
    });

    const { error: updateChurchError } = await adminClient
      .from("churches")
      .update({
        name: parsed.data.churchName,
        slug,
        admin_name: parsed.data.adminName,
        country: parsed.data.country,
        timezone: parsed.data.timezone,
        bio: parsed.data.bio,
        instagram_url: parsed.data.instagramUrl,
        facebook_url: parsed.data.facebookUrl,
        youtube_url: parsed.data.youtubeUrl,
        whatsapp_url: parsed.data.whatsappUrl,
        logo_url: logoUrl,
        onboarding_token: null,
        onboarding_completed: true,
      })
      .eq("id", church.id);

    if (updateChurchError) {
      throw new Error(updateChurchError.message);
    }

    const { error: updateInviteError } = await adminClient
      .from("invites")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
        token: null,
      })
      .eq("id", invite.id);

    if (updateInviteError) {
      throw new Error(updateInviteError.message);
    }

    revalidatePath("/super-admin");
    revalidatePath("/super-admin/invite");
    revalidatePath("/dashboard");

    const supabase = createServerSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: parsed.data.password,
    });

    if (signInError) {
      return {
        status: "success",
        payload: `/login?email=${encodeURIComponent(adminEmail)}&onboarding=complete`,
      };
    }

    return {
      status: "success",
      payload: "/dashboard",
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We could not complete church onboarding. Please try again.";

    return actionError(message);
  }
}
