import { createAdminClient } from "@/lib/supabase/admin";
import { uploadToExternalCloudStorage } from "@/lib/storage-provider";

export const CHURCH_ASSETS_BUCKET = "church-assets";
type AdminClient = ReturnType<typeof createAdminClient>;

export async function uploadChurchLogo(adminClient: AdminClient, churchId: string, file: File) {
  const result = await uploadToExternalCloudStorage(adminClient, {
    folder: "logos",
    entityId: churchId,
    file,
  });

  console.log(`[Storage] Church logo offloaded successfully via ${result.provider}:`, result.publicUrl);
  return result.publicUrl;
}

export async function uploadConferenceBanner(adminClient: AdminClient, churchId: string, file: File) {
  const result = await uploadToExternalCloudStorage(adminClient, {
    folder: "banners",
    entityId: churchId,
    file,
  });

  console.log(`[Storage] Conference banner offloaded successfully via ${result.provider}:`, result.publicUrl);
  return result.publicUrl;
}
