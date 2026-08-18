import { redirect, notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

interface TopLevelSlugPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TopLevelSlugPage({ params, searchParams }: TopLevelSlugPageProps) {
  const rawSlug = params.slug;

  // Ignore system or static files/routes that shouldn't match
  const systemRoutes = [
    "dashboard",
    "super-admin",
    "login",
    "onboarding",
    "c",
    "api",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml",
  ];

  if (systemRoutes.includes(rawSlug.toLowerCase())) {
    notFound();
  }

  const adminClient = createAdminClient();

  // 1. Try finding conference by custom_alias (case-insensitive)
  const { data: aliasConf } = await adminClient
    .from("conferences")
    .select("slug, church_id, churches!inner(slug)")
    .ilike("custom_alias", rawSlug)
    .eq("status", "published")
    .maybeSingle();

  if (aliasConf && aliasConf.churches) {
    const churchSlug = (aliasConf.churches as unknown as { slug: string }).slug;
    const targetUrl = buildTargetUrl(churchSlug, aliasConf.slug, searchParams);
    redirect(targetUrl);
  }

  // 2. Fallback: try finding conference by standard slug
  const { data: slugConf } = await adminClient
    .from("conferences")
    .select("slug, church_id, churches!inner(slug)")
    .eq("slug", rawSlug)
    .eq("status", "published")
    .maybeSingle();

  if (slugConf && slugConf.churches) {
    const churchSlug = (slugConf.churches as unknown as { slug: string }).slug;
    const targetUrl = buildTargetUrl(churchSlug, slugConf.slug, searchParams);
    redirect(targetUrl);
  }

  // 3. Fallback: try finding a church by church slug directly
  const { data: church } = await adminClient
    .from("churches")
    .select("slug")
    .eq("slug", rawSlug)
    .maybeSingle();

  if (church) {
    const query = new URLSearchParams(searchParams as Record<string, string>).toString();
    redirect(`/c/${church.slug}${query ? `?${query}` : ""}`);
  }

  notFound();
}

function buildTargetUrl(
  churchSlug: string,
  conferenceSlug: string,
  searchParams: { [key: string]: string | string[] | undefined }
): string {
  const paramsObj = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      paramsObj.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => paramsObj.append(key, v));
    }
  });

  const queryString = paramsObj.toString();
  return `/c/${churchSlug}/${conferenceSlug}${queryString ? `?${queryString}` : ""}`;
}
