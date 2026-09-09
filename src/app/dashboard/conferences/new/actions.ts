"use server";

import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateUniqueConferenceSlug } from "@/lib/conferences";
import { uploadConferenceBanner } from "@/lib/storage";

export async function saveConferenceAction(formData: FormData) {
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

    // Check maximum conferences limit
    const { count: currentCount } = await adminClient
      .from("conferences")
      .select("id", { count: "exact", head: true })
      .eq("church_id", church.id);

    const maxLimit = church.max_conferences_limit ?? 20;
    if (currentCount !== null && currentCount >= maxLimit) {
      return {
        error: `Limit reached. Your church is allowed a maximum of ${maxLimit} events. Contact support to increase limits.`,
      };
    }

    const name = formData.get("name") as string;
    const theme = (formData.get("theme") as string) || "Revival & Healing";
    const eventType = (formData.get("eventType") as string) || "Conference";
    const speaker = formData.get("speaker") as string;
    const hostName = (formData.get("hostName") as string) || church.admin_name || null;
    const date = formData.get("date") as string;
    const endDate = (formData.get("endDate") as string) || null;
    const startTime = formData.get("startTime") as string;
    const caption = formData.get("caption") as string;
    const streamUrl = formData.get("streamUrl") as string;
    const whatsappGroupUrl = (formData.get("whatsappGroupUrl") as string) || church.whatsapp_group_url || null;
    const whatsappContactNumber = (formData.get("whatsappContactNumber") as string) || church.whatsapp_number || null;
    const templateId = (formData.get("templateId") as string) || church.theme_preference || "modern_gradient";
    const flyerLayout = (formData.get("flyerLayout") as string) || (formData.get("presetId") as string) || null;
    const freeResourceName = (formData.get("freeResourceName") as string) || null;
    const freeResourceUrl = (formData.get("freeResourceUrl") as string) || null;
    const enableReplay = formData.get("enableReplay") === "true";
    const status = (formData.get("status") as string) || "published";
    
    const rsvpLimitRaw = formData.get("rsvpLimit");
    const rsvpLimit = rsvpLimitRaw ? parseInt(rsvpLimitRaw as string, 10) : null;

    const generatedDataStr = formData.get("generatedData") as string;
    const generatedData = generatedDataStr ? JSON.parse(generatedDataStr) : {};

    const banner = formData.get("banner") as File;
    let bannerUrl: string | null = null;

    if (banner && banner.size > 0) {
      try {
        bannerUrl = await uploadConferenceBanner(adminClient, church.id, banner);
      } catch (uploadErr) {
        console.error("Conference banner external upload error:", uploadErr);
        return { error: "Failed to upload conference banner." };
      }
    }

    const slug = await generateUniqueConferenceSlug(adminClient, name, church.id);

    const { error: insertError } = await adminClient.from("conferences").insert({
      church_id: church.id,
      title: name,
      slug,
      caption: caption || null,
      theme: theme || null,
      event_type: eventType,
      speaker_name: speaker || null,
      host_name: hostName,
      conference_date: date || null,
      end_date: endDate,
      conference_time: startTime || null,
      stream_url: streamUrl || null,
      whatsapp_group_url: whatsappGroupUrl,
      whatsapp_contact_number: whatsappContactNumber,
      template_id: templateId,
      flyer_layout: flyerLayout,
      free_resource_name: freeResourceName,
      free_resource_url: freeResourceUrl,
      enable_replay: enableReplay,
      rsvp_limit: isNaN(rsvpLimit as number) ? null : rsvpLimit,
      full_description: generatedData.fullDescription || null,
      agenda: generatedData.agenda || [],
      speaker_bio: generatedData.speakerBio || null,
      banner_url: bannerUrl,
      og_title: generatedData.ogTitle || `${name} | ${church.name}`,
      og_description: generatedData.ogDescription || `Join ${church.name} for ${name}`,
      social_captions: generatedData.socialCaptions || {},
      status,
    });

    if (insertError) {
      console.error("Conference insert error:", insertError);
      return { error: `Failed to save conference: ${insertError.message}` };
    }

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("saveConferenceAction error:", err);
    return { error: err.message || "Something went wrong." };
  }
}
