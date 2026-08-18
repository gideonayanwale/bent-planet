"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { uploadChurchLogo, uploadChurchBanner } from "@/lib/storage";

const settingsSchema = z.object({
  name: z.string().min(2, "Church name must be at least 2 characters."),
  bio: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  admin_name: z.string().optional(),
  instagram_url: z.string().url().optional().or(z.literal("")),
  facebook_url: z.string().url().optional().or(z.literal("")),
  youtube_url: z.string().url().optional().or(z.literal("")),
  whatsapp_url: z.string().url().optional().or(z.literal("")),
  whatsapp_channel_url: z.string().url().optional().or(z.literal("")),
  whatsapp_group_url: z.string().url().optional().or(z.literal("")),
  whatsapp_number: z.string().optional().or(z.literal("")),
});

export async function saveChurchSettings(formData: FormData) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const church = await getChurchByAdminEmail(adminClient, user.email!);
    if (!church) {
      throw new Error("Church workspace not found.");
    }

    const data = {
      name: formData.get("name") as string,
      bio: formData.get("bio") as string,
      country: formData.get("country") as string,
      timezone: formData.get("timezone") as string,
      admin_name: formData.get("admin_name") as string,
      instagram_url: formData.get("instagram_url") as string,
      facebook_url: formData.get("facebook_url") as string,
      youtube_url: formData.get("youtube_url") as string,
      whatsapp_url: formData.get("whatsapp_url") as string,
      whatsapp_channel_url: formData.get("whatsapp_channel_url") as string,
      whatsapp_group_url: formData.get("whatsapp_group_url") as string,
      whatsapp_number: formData.get("whatsapp_number") as string,
    };

    const parsed = settingsSchema.parse(data);

    let logo_url = church.logo_url;
    const logoFile = formData.get("logo") as File;
    if (logoFile && logoFile.size > 0) {
      try {
        logo_url = await uploadChurchLogo(adminClient, church.id, logoFile);
      } catch (uploadErr) {
        console.error("Failed to upload church logo:", uploadErr);
        throw new Error("Failed to upload church logo.");
      }
    }

    let banner_url = church.banner_url;
    const bannerFile = formData.get("banner") as File;
    if (bannerFile && bannerFile.size > 0) {
      try {
        banner_url = await uploadChurchBanner(adminClient, church.id, bannerFile);
      } catch (uploadErr) {
        console.error("Failed to upload church banner:", uploadErr);
        throw new Error("Failed to upload church banner.");
      }
    }

    const { error } = await adminClient
      .from("churches")
      .update({
        ...parsed,
        logo_url,
        banner_url,
      })
      .eq("id", church.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    revalidatePath(`/c/${church.slug}`);
    revalidatePath(`/c/${church.slug}`, "page");

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message || "Failed to update settings");
  }
}
