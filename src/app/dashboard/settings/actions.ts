"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireChurchUser } from "@/lib/current-user";

const settingsSchema = z.object({
  name: z.string().min(2),
  bio: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  admin_name: z.string().optional(),
  instagram_url: z.string().url().optional().or(z.literal("")),
  facebook_url: z.string().url().optional().or(z.literal("")),
  youtube_url: z.string().url().optional().or(z.literal("")),
  whatsapp_url: z.string().url().optional().or(z.literal("")),
});

export async function saveChurchSettings(formData: FormData) {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

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
    };

    const parsed = settingsSchema.parse(data);

    const { error } = await adminClient
      .from("churches")
      .update(parsed)
      .eq("admin_email", user.email!);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/c/[church-slug]", "page");
    
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Failed to update settings" };
  }
}

