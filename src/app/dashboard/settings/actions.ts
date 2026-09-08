"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { uploadChurchLogo, uploadChurchBanner } from "@/lib/storage";

function cleanString(val: FormDataEntryValue | null): string | null {
  if (typeof val !== "string") return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function cleanUrl(
  val: FormDataEntryValue | null,
  fieldName: string,
): { url: string | null; error?: string } {
  if (typeof val !== "string") return { url: null };
  const trimmed = val.trim();
  if (!trimmed) return { url: null };

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return { url: null, error: `Please enter a valid URL for ${fieldName}.` };
    }
    return { url: withProtocol };
  } catch {
    return { url: null, error: `Please enter a valid URL for ${fieldName}.` };
  }
}

export async function saveChurchSettings(
  formData: FormData,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    if (!user.email) {
      return { error: "You must be signed in to update church settings." };
    }

    const church = await getChurchByAdminEmail(adminClient, user.email);
    if (!church) {
      return { error: "Church workspace not found." };
    }

    const name = cleanString(formData.get("name"));
    if (!name || name.length < 2) {
      return { error: "Church name must be at least 2 characters." };
    }

    // Validate URLs with friendly normalization
    const instagram = cleanUrl(formData.get("instagram_url"), "Instagram URL");
    if (instagram.error) return { error: instagram.error };

    const facebook = cleanUrl(formData.get("facebook_url"), "Facebook URL");
    if (facebook.error) return { error: facebook.error };

    const youtube = cleanUrl(formData.get("youtube_url"), "YouTube URL");
    if (youtube.error) return { error: youtube.error };

    const whatsappChannel = cleanUrl(
      formData.get("whatsapp_channel_url"),
      "WhatsApp Channel Link",
    );
    if (whatsappChannel.error) return { error: whatsappChannel.error };

    const whatsappGroup = cleanUrl(
      formData.get("whatsapp_group_url"),
      "WhatsApp Group Link",
    );
    if (whatsappGroup.error) return { error: whatsappGroup.error };

    const churchWebsite = cleanUrl(
      formData.get("church_website_url"),
      "Official Website",
    );
    if (churchWebsite.error) return { error: churchWebsite.error };

    // Logo upload
    let logo_url = church.logo_url;
    const logoFile = formData.get("logo") as File | null;
    if (logoFile && logoFile instanceof File && logoFile.size > 0) {
      try {
        logo_url = await uploadChurchLogo(adminClient, church.id, logoFile);
      } catch (uploadErr) {
        console.error("Failed to upload church logo:", uploadErr);
        return {
          error: "Failed to upload church logo. Please check the image and try again.",
        };
      }
    }

    // Banner upload
    let banner_url = church.banner_url;
    const bannerFile = formData.get("banner") as File | null;
    if (bannerFile && bannerFile instanceof File && bannerFile.size > 0) {
      try {
        banner_url = await uploadChurchBanner(adminClient, church.id, bannerFile);
      } catch (uploadErr) {
        console.error("Failed to upload church banner:", uploadErr);
        return {
          error: "Failed to upload church banner. Please check the image and try again.",
        };
      }
    }

    const updatePayload = {
      name,
      bio: cleanString(formData.get("bio")),
      country: cleanString(formData.get("country")),
      timezone: cleanString(formData.get("timezone")) || "Africa/Lagos",
      admin_name: cleanString(formData.get("admin_name")),
      denomination: cleanString(formData.get("denomination")),
      motto: cleanString(formData.get("motto")),
      year_founded: cleanString(formData.get("year_founded")),
      address_line1: cleanString(formData.get("address_line1")),
      address_line2: cleanString(formData.get("address_line2")),
      whatsapp_number: cleanString(formData.get("whatsapp_number")),
      instagram_url: instagram.url,
      facebook_url: facebook.url,
      youtube_url: youtube.url,
      whatsapp_channel_url: whatsappChannel.url,
      whatsapp_group_url: whatsappGroup.url,
      whatsapp_url: whatsappGroup.url, // Keep backward compatible
      church_website_url: churchWebsite.url,
      logo_url,
      banner_url,
    };

    const { error: updateError } = await adminClient
      .from("churches")
      .update(updatePayload)
      .eq("id", church.id);

    if (updateError) {
      console.error("Failed to update church record:", updateError);
      return { error: `Failed to update settings: ${updateError.message}` };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath(`/c/${church.slug}`);
    revalidatePath(`/c/${church.slug}`, "page");

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("saveChurchSettings unexpected error:", err);
    return { error: err.message || "An unexpected error occurred while saving settings." };
  }
}
