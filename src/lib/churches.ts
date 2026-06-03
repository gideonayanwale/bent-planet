import { appendRandomSuffix, slugify } from "@/lib/slugs";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type AdminClient = ReturnType<typeof createAdminClient>;
type ChurchRow = Database["public"]["Tables"]["churches"]["Row"];

export async function getChurchByAdminEmail(adminClient: AdminClient, adminEmail: string) {
  const { data, error } = await adminClient
    .from("churches")
    .select("*")
    .eq("admin_email", adminEmail)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load church record: ${error.message}`);
  }

  return data;
}

export async function generateUniqueChurchSlug(
  adminClient: AdminClient,
  churchName: string,
  excludeChurchId?: ChurchRow["id"],
) {
  const baseSlug = slugify(churchName) || "church";
  let candidate = baseSlug;

  while (true) {
    let query = adminClient.from("churches").select("id").eq("slug", candidate);

    if (excludeChurchId) {
      query = query.neq("id", excludeChurchId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw new Error(`Failed to validate church slug: ${error.message}`);
    }

    if (!data) {
      return candidate;
    }

    candidate = appendRandomSuffix(baseSlug);
  }
}
