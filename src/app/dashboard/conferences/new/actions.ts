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
    const theme = formData.get("theme") as string;
    const speaker = formData.get("speaker") as string;
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const caption = formData.get("caption") as string;

    const generatedDataStr = formData.get("generatedData") as string;
    const generatedData = JSON.parse(generatedDataStr);

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
      caption,
      theme,
      speaker_name: speaker,
      conference_date: date,
      conference_time: startTime,
      full_description: generatedData.fullDescription,
      agenda: generatedData.agenda,
      speaker_bio: generatedData.speakerBio,
      banner_url: bannerUrl,
      og_title: generatedData.ogTitle,
      og_description: generatedData.ogDescription,
      social_captions: generatedData.socialCaptions,
      status: "published",
    });

    if (insertError) {
      console.error("Conference insert error:", insertError);
      return { error: "Failed to save conference." };
    }

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("saveConferenceAction error:", err);
    return { error: err.message || "Something went wrong." };
  }
}
