"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdminUser } from "@/lib/current-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateUniqueChurchSlug } from "@/lib/churches";
import { generateOnboardingToken, buildOnboardingUrl } from "@/lib/invites";
import { sendChurchInviteEmail } from "@/lib/email";

export async function approveAccessRequestAction(requestId: string) {
  try {
    await requireSuperAdminUser();
    const adminClient = createAdminClient();

    const { data: request, error: fetchErr } = await adminClient
      .from("access_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchErr || !request) {
      return { error: "Access request not found." };
    }

    const email = request.email.trim().toLowerCase();
    const churchName = request.church_name.trim();
    const token = generateOnboardingToken();
    const invitedAt = new Date().toISOString();
    const slug = await generateUniqueChurchSlug(adminClient, churchName);

    // Create or update placeholder church
    const { data: existingChurch } = await adminClient
      .from("churches")
      .select("id")
      .eq("admin_email", email)
      .maybeSingle();

    if (existingChurch) {
      await adminClient
        .from("churches")
        .update({
          name: churchName,
          slug,
          admin_name: request.admin_name,
          country: request.country,
          denomination: request.denomination,
          whatsapp_number: request.phone,
          onboarding_token: token,
          onboarding_completed: false,
          invited_at: invitedAt,
        })
        .eq("id", existingChurch.id);
    } else {
      await adminClient.from("churches").insert({
        name: churchName,
        slug,
        admin_email: email,
        admin_name: request.admin_name,
        country: request.country,
        denomination: request.denomination,
        whatsapp_number: request.phone,
        onboarding_token: token,
        onboarding_completed: false,
        invited_at: invitedAt,
      });
    }

    // Upsert invite
    await adminClient.from("invites").upsert(
      {
        church_name: churchName,
        email,
        token,
        status: "pending",
        invited_at: invitedAt,
      },
      { onConflict: "email" }
    );

    // Update request status
    await adminClient
      .from("access_requests")
      .update({ status: "approved" })
      .eq("id", requestId);

    // Dispatch email
    try {
      await sendChurchInviteEmail({
        adminEmail: email,
        churchName,
        inviteUrl: buildOnboardingUrl(token),
      });
    } catch (emailErr) {
      console.error("Failed to send invite email:", emailErr);
    }

    revalidatePath("/super-admin");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("approveAccessRequestAction error:", err);
    return { error: err.message || "Failed to approve request." };
  }
}

export async function rejectAccessRequestAction(requestId: string) {
  try {
    await requireSuperAdminUser();
    const adminClient = createAdminClient();

    await adminClient
      .from("access_requests")
      .update({ status: "rejected" })
      .eq("id", requestId);

    revalidatePath("/super-admin");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Failed to reject request." };
  }
}

export async function sendSystemAnnouncementAction(title: string, message: string, targetAudience = "all_churches") {
  try {
    const user = await requireSuperAdminUser();
    const adminClient = createAdminClient();

    if (!title || !message) {
      return { error: "Title and message are required." };
    }

    await adminClient.from("system_announcements").insert({
      title,
      message,
      target_audience: targetAudience,
      sent_by: user.email || "Super Admin",
    });

    revalidatePath("/super-admin");
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Failed to dispatch announcement." };
  }
}
