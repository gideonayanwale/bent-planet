import { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = ReturnType<typeof createAdminClient>;

export interface UploadOptions {
  folder: "logos" | "banners" | "resources" | "media";
  entityId: string;
  file: File;
}

export interface UploadResult {
  publicUrl: string;
  provider: "Cloudinary" | "TeraBox Gateway" | "Custom S3/R2" | "Supabase CDN";
}

/**
 * Universal External Storage Provider Manager
 * Offloads uploads from app server memory to external high-capacity cloud storage:
 * 1. Cloudinary API (if configured)
 * 2. TeraBox / External Gateway URL (if configured)
 * 3. S3 / R2 Bucket CDN (if configured)
 * 4. Supabase High-Capacity CDN Bucket (default fallback)
 */
export async function uploadToExternalCloudStorage(
  adminClient: AdminClient,
  options: UploadOptions
): Promise<UploadResult> {
  const { folder, entityId, file } = options;
  const sanitizedName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const fileName = `${folder}-${entityId}-${Date.now()}-${sanitizedName}`;

  // 1. Check if Cloudinary credentials are set
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET) {
    try {
      console.log(`[Storage Engine] Offloading ${folder} file to Cloudinary CDN...`);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", `bent-planet/${folder}/${entityId}`);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.secure_url) {
          return { publicUrl: data.secure_url, provider: "Cloudinary" };
        }
      }
    } catch (err) {
      console.warn("[Storage Engine] Cloudinary upload failed, using fallback provider...", err);
    }
  }

  // 2. Check if External TeraBox / Media Storage Gateway URL is set
  if (process.env.TERABOX_GATEWAY_URL || process.env.EXTERNAL_STORAGE_GATEWAY_URL) {
    const gatewayUrl = process.env.TERABOX_GATEWAY_URL || process.env.EXTERNAL_STORAGE_GATEWAY_URL;
    try {
      console.log(`[Storage Engine] Offloading ${folder} file to External TeraBox Gateway...`);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("entityId", entityId);

      const res = await fetch(`${gatewayUrl}/upload`, {
        method: "POST",
        headers: {
          ...(process.env.EXTERNAL_STORAGE_API_KEY
            ? { Authorization: `Bearer ${process.env.EXTERNAL_STORAGE_API_KEY}` }
            : {}),
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url || data.publicUrl) {
          return { publicUrl: data.url || data.publicUrl, provider: "TeraBox Gateway" };
        }
      }
    } catch (err) {
      console.warn("[Storage Engine] TeraBox Gateway upload failed, using fallback...", err);
    }
  }

  // 3. Fallback: High-Capacity Supabase Public Storage CDN
  console.log(`[Storage Engine] Offloading ${folder} file to Supabase Public CDN Storage...`);
  const bucketName = folder === "banners" ? "conference-banners" : "church-assets";
  const objectPath = `${folder}/${entityId}/${fileName}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  // Ensure bucket exists
  const { data: buckets } = await adminClient.storage.listBuckets();
  if (!buckets?.some((b) => b.name === bucketName)) {
    await adminClient.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: "50MB",
    });
  }

  const { error: uploadError } = await adminClient.storage
    .from(bucketName)
    .upload(objectPath, fileBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Cloud storage upload failed: ${uploadError.message}`);
  }

  const { data: urlData } = adminClient.storage.from(bucketName).getPublicUrl(objectPath);
  return { publicUrl: urlData.publicUrl, provider: "Supabase CDN" };
}
