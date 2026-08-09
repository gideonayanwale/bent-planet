import type { Database } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";
import { appendRandomSuffix, slugify } from "@/lib/slugs";

type AdminClient = ReturnType<typeof createAdminClient>;
export type ConferenceRow = Database["public"]["Tables"]["conferences"]["Row"];

export async function getConferencesByChurchId(adminClient: AdminClient, churchId: string) {
  const { data, error } = await adminClient
    .from("conferences")
    .select("*")
    .eq("church_id", churchId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to load conferences: ${error.message}`);
  return data;
}

export async function getConferenceById(adminClient: AdminClient, id: string) {
  const { data, error } = await adminClient
    .from("conferences")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Failed to load conference: ${error.message}`);
  return data;
}

export async function getPublicConference(
  adminClient: AdminClient,
  churchSlug: string,
  conferenceSlug: string,
) {
  const { data, error } = await adminClient
    .from("conferences")
    .select("*, churches!inner(id, name, slug, logo_url, bio, instagram_url, facebook_url, youtube_url, whatsapp_url)")
    .eq("slug", conferenceSlug)
    .eq("churches.slug", churchSlug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`Failed to load conference: ${error.message}`);
  return data;
}

export async function generateUniqueConferenceSlug(
  adminClient: AdminClient,
  title: string,
  churchId: string,
  excludeId?: string,
) {
  const baseSlug = slugify(title) || "conference";
  let candidate = baseSlug;

  while (true) {
    let query = adminClient
      .from("conferences")
      .select("id")
      .eq("church_id", churchId)
      .eq("slug", candidate);

    if (excludeId) query = query.neq("id", excludeId);

    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(`Failed to validate conference slug: ${error.message}`);
    if (!data) return candidate;
    candidate = appendRandomSuffix(baseSlug);
  }
}
