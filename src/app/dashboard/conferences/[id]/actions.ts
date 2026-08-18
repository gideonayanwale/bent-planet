"use server";

import { revalidatePath } from "next/cache";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { getConferenceById } from "@/lib/conferences";
import { uploadConferenceBanner } from "@/lib/storage";

export async function updateConferenceAction(conferenceId: string, formData: FormData) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      return { error: "Church workspace not found." };
    }

    const conference = await getConferenceById(adminClient, conferenceId);
    if (!conference || conference.church_id !== church.id) {
      return { error: "Conference not found or unauthorized." };
    }

    const title = formData.get("name") as string;
    const theme = formData.get("theme") as string;
    const speaker_name = formData.get("speaker") as string;
    const conference_date = formData.get("date") as string;
    const conference_time = formData.get("startTime") as string;
    const stream_url = formData.get("streamUrl") as string;
    const whatsapp_group_url = formData.get("whatsappGroupUrl") as string;
    const whatsapp_channel_url = formData.get("whatsappChannelUrl") as string;
    const short_url = formData.get("shortUrl") as string;
    const caption = formData.get("caption") as string;
    const full_description = formData.get("fullDescription") as string;
    const speaker_bio = formData.get("speakerBio") as string;
    const status = (formData.get("status") as string) || conference.status || "published";
    const enable_replay = formData.get("enableReplay") === "true";
    const free_resource_url = formData.get("freeResourceUrl") as string;
    const free_resource_name = formData.get("freeResourceName") as string;

    const agendaStr = formData.get("agenda") as string;
    let agenda = conference.agenda;
    if (agendaStr) {
      try {
        agenda = JSON.parse(agendaStr);
      } catch (e) {
        console.warn("Failed to parse agenda JSON:", e);
      }
    }

    let banner_url = conference.banner_url;
    const banner = formData.get("banner") as File;
    if (banner && banner.size > 0) {
      try {
        banner_url = await uploadConferenceBanner(adminClient, church.id, banner);
      } catch (uploadErr) {
        console.error("Conference banner upload error during update:", uploadErr);
        return { error: "Failed to upload new banner image." };
      }
    }

    const { error: updateError } = await adminClient
      .from("conferences")
      .update({
        title: title || conference.title,
        theme: theme || conference.theme,
        speaker_name: speaker_name || conference.speaker_name,
        conference_date: conference_date || conference.conference_date,
        conference_time: conference_time || conference.conference_time,
        stream_url: stream_url !== undefined ? stream_url : conference.stream_url,
        whatsapp_group_url: whatsapp_group_url !== undefined ? whatsapp_group_url : conference.whatsapp_group_url,
        whatsapp_channel_url: whatsapp_channel_url !== undefined ? whatsapp_channel_url : conference.whatsapp_channel_url,
        short_url: short_url !== undefined ? short_url : conference.short_url,
        caption: caption !== undefined ? caption : conference.caption,
        full_description: full_description !== undefined ? full_description : conference.full_description,
        speaker_bio: speaker_bio !== undefined ? speaker_bio : conference.speaker_bio,
        status,
        enable_replay,
        free_resource_url: free_resource_url !== undefined ? free_resource_url : conference.free_resource_url,
        free_resource_name: free_resource_name !== undefined ? free_resource_name : conference.free_resource_name,
        agenda,
        banner_url,
      })
      .eq("id", conferenceId)
      .eq("church_id", church.id);

    if (updateError) {
      console.error("Update conference error:", updateError);
      return { error: `Failed to update conference: ${updateError.message}` };
    }

    revalidatePath("/dashboard/conferences");
    revalidatePath(`/dashboard/conferences/${conferenceId}/edit`);
    revalidatePath(`/dashboard/conferences/${conferenceId}/promote`);
    revalidatePath(`/c/${church.slug}/${conference.slug}`);
    revalidatePath(`/c/${church.slug}`);

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("updateConferenceAction error:", err);
    return { error: err.message || "Something went wrong." };
  }
}

export async function deleteConferenceAction(conferenceId: string) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      return { error: "Church workspace not found." };
    }

    const conference = await getConferenceById(adminClient, conferenceId);
    if (!conference || conference.church_id !== church.id) {
      return { error: "Conference not found or unauthorized." };
    }

    // 1. Clean up child relations safely before deleting conference
    // Delete UTM clicks associated with this conference
    await adminClient
      .from("utm_clicks")
      .delete()
      .eq("conference_id", conferenceId)
      .eq("church_id", church.id);

    // Unlink or delete email logs associated with this conference
    await adminClient
      .from("email_log")
      .delete()
      .eq("conference_id", conferenceId)
      .eq("church_id", church.id);

    // Unlink subscribers associated with this conference (set conference_id to null) or keep church_id intact
    await adminClient
      .from("subscribers")
      .delete()
      .eq("conference_id", conferenceId)
      .eq("church_id", church.id);

    // 2. Delete the conference
    const { error: deleteError } = await adminClient
      .from("conferences")
      .delete()
      .eq("id", conferenceId)
      .eq("church_id", church.id);

    if (deleteError) {
      console.error("Delete conference error:", deleteError);
      return { error: `Failed to delete conference: ${deleteError.message}` };
    }

    revalidatePath("/dashboard/conferences");
    revalidatePath("/dashboard");
    revalidatePath(`/c/${church.slug}`);

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("deleteConferenceAction error:", err);
    return { error: err.message || "Failed to delete conference." };
  }
}

export async function toggleConferenceStatusAction(conferenceId: string, newStatus: string) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      return { error: "Church workspace not found." };
    }

    const { error } = await adminClient
      .from("conferences")
      .update({ status: newStatus })
      .eq("id", conferenceId)
      .eq("church_id", church.id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard/conferences");
    revalidatePath(`/dashboard/conferences/${conferenceId}/edit`);
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Failed to update status." };
  }
}
