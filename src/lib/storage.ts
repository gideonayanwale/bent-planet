import { createAdminClient } from "@/lib/supabase/admin";

export const CHURCH_ASSETS_BUCKET = "church-assets";

type AdminClient = ReturnType<typeof createAdminClient>;

export async function ensureChurchAssetsBucket(adminClient: AdminClient) {
  const { data: buckets, error } = await adminClient.storage.listBuckets();

  if (error) {
    throw new Error(`Failed to inspect storage buckets: ${error.message}`);
  }

  if (buckets.some((bucket) => bucket.name === CHURCH_ASSETS_BUCKET)) {
    return;
  }

  const { error: createError } = await adminClient.storage.createBucket(CHURCH_ASSETS_BUCKET, {
    public: true,
    fileSizeLimit: "5MB",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
  });

  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    throw new Error(`Failed to create church assets bucket: ${createError.message}`);
  }
}

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function uploadChurchLogo(adminClient: AdminClient, churchId: string, file: File) {
  await ensureChurchAssetsBucket(adminClient);

  const fileName = sanitizeFileName(file.name) || "church-logo";
  const objectPath = `logos/${churchId}/${Date.now()}-${fileName}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await adminClient.storage
    .from(CHURCH_ASSETS_BUCKET)
    .upload(objectPath, fileBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload church logo: ${uploadError.message}`);
  }

  const { data } = adminClient.storage.from(CHURCH_ASSETS_BUCKET).getPublicUrl(objectPath);

  return data.publicUrl;
}
