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

    const name = formData.get("name") as string;
    const theme = (formData.get("theme") as string) || "Revival & Healing";
    const speaker = formData.get("speaker") as string;
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const caption = formData.get("caption") as string;
    const streamUrl = formData.get("streamUrl") as string;
    const whatsappGroupUrl = (formData.get("whatsappGroupUrl") as string) || church.whatsapp_group_url || null;
    const whatsappChannelUrl = (formData.get("whatsappChannelUrl") as string) || church.whatsapp_channel_url || null;
    const enableReplay = formData.get("enableReplay") === "true";
    const status = (formData.get("status") as string) || "published";

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
    const publicAppUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bentplanet.com";
    const longUrl = `${publicAppUrl}/c/${church.slug}/${slug}`;
    const { shortenUrl } = await import("@/lib/bitly");
    const shortUrl = await shortenUrl(longUrl);

    const { error: insertError } = await adminClient.from("conferences").insert({
      church_id: church.id,
      title: name,
      slug,
      caption: caption || null,
      theme: theme || null,
      speaker_name: speaker || null,
      conference_date: date || null,
      conference_time: startTime || null,
      stream_url: streamUrl || null,
      whatsapp_group_url: whatsappGroupUrl,
      whatsapp_channel_url: whatsappChannelUrl,
      short_url: shortUrl !== longUrl ? shortUrl : null,
      enable_replay: enableReplay,
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
