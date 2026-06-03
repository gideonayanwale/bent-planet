"use server";

import { revalidatePath } from "next/cache";

import { getChurchByAdminEmail, generateUniqueChurchSlug } from "@/lib/churches";
import { requireSuperAdminUser } from "@/lib/current-user";
import { sendChurchInviteEmail } from "@/lib/email";
import {
  actionError,
  actionSuccess,
  fromValidationError,
  getFormValue,
  inviteSchema,
  type ActionState,
} from "@/lib/forms";
import { buildOnboardingUrl, generateOnboardingToken, normalizeEmail } from "@/lib/invites";
import { createAdminClient } from "@/lib/supabase/admin";

export async function inviteChurchAction(formData: FormData): Promise<ActionState> {
  await requireSuperAdminUser();

  const parsed = inviteSchema.safeParse({
    churchName: getFormValue(formData, "churchName"),
    adminEmail: getFormValue(formData, "adminEmail"),
  });

  if (!parsed.success) {
    return fromValidationError(parsed.error);
  }

  const adminClient = createAdminClient();
  const churchName = parsed.data.churchName;
  const adminEmail = normalizeEmail(parsed.data.adminEmail);

  try {
    const existingChurch = await getChurchByAdminEmail(adminClient, adminEmail);

    if (existingChurch?.onboarding_completed) {
      return actionError("That church admin has already completed onboarding.");
    }

    const slug = await generateUniqueChurchSlug(adminClient, churchName, existingChurch?.id);
    const token = generateOnboardingToken();
    const invitedAt = new Date().toISOString();

    let churchId = existingChurch?.id;

    if (existingChurch) {
      const { error: updateChurchError } = await adminClient
        .from("churches")
        .update({
          name: churchName,
          slug,
          admin_email: adminEmail,
          onboarding_token: token,
          onboarding_completed: false,
          invited_at: invitedAt,
        })
        .eq("id", existingChurch.id);

      if (updateChurchError) {
        throw new Error(updateChurchError.message);
      }
    } else {
      const { data: insertedChurch, error: insertChurchError } = await adminClient
        .from("churches")
        .insert({
          name: churchName,
          slug,
          admin_email: adminEmail,
          onboarding_token: token,
          onboarding_completed: false,
          invited_at: invitedAt,
        })
        .select("id")
        .single();

      if (insertChurchError || !insertedChurch) {
        throw new Error(insertChurchError?.message ?? "Failed to create placeholder church.");
      }

      churchId = insertedChurch.id;
    }

    const { data: existingInvite, error: inviteLookupError } = await adminClient
      .from("invites")
      .select("id,status")
      .eq("email", adminEmail)
      .maybeSingle();

    if (inviteLookupError) {
      throw new Error(inviteLookupError.message);
    }

    const wasPendingInvite = existingInvite?.status === "pending";

    if (existingInvite) {
      const { error: updateInviteError } = await adminClient
        .from("invites")
        .update({
          church_name: churchName,
          token,
          status: "pending",
          invited_at: invitedAt,
          accepted_at: null,
        })
        .eq("id", existingInvite.id);

      if (updateInviteError) {
        throw new Error(updateInviteError.message);
      }
    } else {
      const { error: insertInviteError } = await adminClient.from("invites").insert({
        church_name: churchName,
        email: adminEmail,
        token,
        status: "pending",
        invited_at: invitedAt,
      });

      if (insertInviteError) {
        throw new Error(insertInviteError.message);
      }
    }

    if (!churchId) {
      throw new Error("Failed to resolve the invited church.");
    }

    await sendChurchInviteEmail({
      adminEmail,
      churchName,
      inviteUrl: buildOnboardingUrl(token),
    });

    revalidatePath("/super-admin");
    revalidatePath("/super-admin/invite");

    return actionSuccess(
      wasPendingInvite ? `Invite resent to ${adminEmail}.` : `Invite sent to ${adminEmail}.`,
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The invite could not be completed. Please try again.";

    return actionError(message);
  }
}
