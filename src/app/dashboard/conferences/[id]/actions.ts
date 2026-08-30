"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { uploadConferenceBanner } from "@/lib/storage";

const conferenceUpdateSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  caption: z.string().optional().nullable(),
  theme: z.string().optional().nullable(),
  event_type: z.string().optional().nullable(),
  speaker_name: z.string().optional().nullable(),
  host_name: z.string().optional().nullable(),
  speaker_role: z.string().optional().nullable(),
  speaker_bio: z.string().optional().nullable(),
  conference_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  conference_time: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  stream_url: z.string().url().optional().or(z.literal("")).nullable(),
  whatsapp_group_url: z.string().url().optional().or(z.literal("")).nullable(),
  whatsapp_contact_number: z.string().optional().nullable(),
  template_id: z.string().optional().nullable(),
  free_resource_name: z.string().optional().nullable(),
  free_resource_url: z.string().optional().nullable(),
  enable_replay: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  full_description: z.string().optional().nullable(),
  og_title: z.string().optional().nullable(),
  og_description: z.string().optional().nullable(),
});

export async function updateConferenceAction(id: string, formData: FormData) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      return { error: "Church not found." };
    }

    if (church.status === "suspended") {
      return { error: "This workspace has been suspended. Please contact operations support." };
    }

    const { data: existingConf } = await adminClient
      .from("conferences")
      .select("*")
      .eq("id", id)
      .eq("church_id", church.id)
      .maybeSingle();

    if (!existingConf) {
      return { error: "Conference not found or access denied." };
    }

    const rawData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      caption: (formData.get("caption") as string) || null,
      theme: (formData.get("theme") as string) || null,
      event_type: (formData.get("event_type") as string) || "Conference",
      speaker_name: (formData.get("speaker_name") as string) || null,
      host_name: (formData.get("host_name") as string) || null,
      speaker_role: (formData.get("speaker_role") as string) || null,
      speaker_bio: (formData.get("speaker_bio") as string) || null,
      conference_date: (formData.get("conference_date") as string) || null,
      end_date: (formData.get("end_date") as string) || null,
      conference_time: (formData.get("conference_time") as string) || null,
      timezone: (formData.get("timezone") as string) || church.timezone || null,
      stream_url: (formData.get("stream_url") as string) || null,
      whatsapp_group_url: (formData.get("whatsapp_group_url") as string) || null,
      whatsapp_contact_number: (formData.get("whatsapp_contact_number") as string) || null,
      template_id: (formData.get("template_id") as string) || "modern_gradient",
      free_resource_name: (formData.get("free_resource_name") as string) || null,
      free_resource_url: (formData.get("free_resource_url") as string) || null,
      enable_replay: formData.get("enable_replay") === "true",
      status: (formData.get("status") as "draft" | "published" | "archived") || "published",
      full_description: (formData.get("full_description") as string) || null,
      og_title: (formData.get("og_title") as string) || null,
      og_description: (formData.get("og_description") as string) || null,
    };

    const parsed = conferenceUpdateSchema.parse(rawData);

    // Agenda handling
    const agendaStr = formData.get("agenda") as string;
    let agenda = existingConf.agenda;
    if (agendaStr) {
      try {
        agenda = JSON.parse(agendaStr);
      } catch {
        // Keep existing if parse fails
      }
    }

    // Banner handling
    const bannerFile = formData.get("banner") as File;
    let bannerUrl = existingConf.banner_url;
    if (bannerFile && bannerFile.size > 0) {
      try {
        bannerUrl = await uploadConferenceBanner(adminClient, church.id, bannerFile);
      } catch (uploadErr) {
        console.error("Banner upload failed:", uploadErr);
        return { error: "Failed to upload new banner image." };
      }
    }

    const { error: updateError } = await adminClient
      .from("conferences")
      .update({
        ...parsed,
        banner_url: bannerUrl,
        agenda,
      })
      .eq("id", id)
      .eq("church_id", church.id);

    if (updateError) {
      return { error: updateError.message };
    }

    revalidatePath(`/dashboard/conferences`);
    revalidatePath(`/dashboard/conferences/${id}/edit`);
    revalidatePath(`/c/${church.slug}/${parsed.slug}`);
    revalidatePath(`/c/${church.slug}`);

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("updateConferenceAction error:", err);
    return { error: err.message || "Failed to update conference." };
  }
}

export async function deleteConferenceAction(id: string) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      return { error: "Church not found." };
    }

    // Cascading cleanups
    await adminClient.from("utm_clicks").delete().eq("conference_id", id);
    await adminClient.from("email_log").delete().eq("conference_id", id);
    await adminClient.from("subscribers").delete().eq("conference_id", id);

    const { error: deleteError } = await adminClient
      .from("conferences")
      .delete()
      .eq("id", id)
      .eq("church_id", church.id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    revalidatePath("/dashboard/conferences");
    revalidatePath(`/c/${church.slug}`);

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Failed to delete conference." };
  }
}

export async function toggleConferenceStatusAction(id: string, newStatus: "published" | "draft" | "archived") {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      return { error: "Church not found." };
    }

    const { error } = await adminClient
      .from("conferences")
      .update({ status: newStatus })
      .eq("id", id)
      .eq("church_id", church.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard/conferences");
    revalidatePath(`/c/${church.slug}`);

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Failed to update status." };
  }
}

export async function updateCustomAliasAction(conferenceId: string, rawAlias: string) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      return { error: "Church workspace not found." };
    }

    const cleanAlias = rawAlias.trim().replace(/^\/+|\/+$/g, "").replace(/\s+/g, "_");

    if (cleanAlias.length < 2) {
      return { error: "Custom back-half alias must be at least 2 characters." };
    }

    const reserved = ["dashboard", "super-admin", "login", "onboarding", "c", "api"];
    if (reserved.includes(cleanAlias.toLowerCase())) {
      return { error: "This custom back-half is reserved by the system." };
    }

    const { data: existing } = await adminClient
      .from("conferences")
      .select("id")
      .ilike("custom_alias", cleanAlias)
      .neq("id", conferenceId)
      .maybeSingle();

    if (existing) {
      return { error: "This custom back-half is already in use by another conference." };
    }

    const { error: updateErr } = await adminClient
      .from("conferences")
      .update({ custom_alias: cleanAlias })
      .eq("id", conferenceId)
      .eq("church_id", church.id);

    if (updateErr) {
      return { error: updateErr.message };
    }

    revalidatePath(`/dashboard/conferences/${conferenceId}/promote`);
    revalidatePath(`/dashboard/conferences/${conferenceId}/edit`);
    return { success: true, alias: cleanAlias };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Failed to update custom alias." };
  }
}

export async function generateBitlyUrlAction(conferenceId: string) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      return { error: "Church workspace not found." };
    }

    const { data: conference } = await adminClient
      .from("conferences")
      .select("slug")
      .eq("id", conferenceId)
      .eq("church_id", church.id)
      .maybeSingle();

    if (!conference) {
      return { error: "Conference not found." };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bentplanet.com";
    const longUrl = `${baseUrl}/c/${church.slug}/${conference.slug}`;

    const { shortenUrl } = await import("@/lib/bitly");
    const shortUrl = await shortenUrl(longUrl);

    const { error: updateErr } = await adminClient
      .from("conferences")
      .update({ short_url: shortUrl })
      .eq("id", conferenceId)
      .eq("church_id", church.id);

    if (updateErr) {
      return { error: updateErr.message };
    }

    revalidatePath(`/dashboard/conferences/${conferenceId}/promote`);
    return { success: true, shortUrl };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Failed to generate Bitly short link." };
  }
}
