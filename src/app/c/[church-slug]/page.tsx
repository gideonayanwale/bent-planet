import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
  VideoIcon,
  SparklesIcon,
  ArrowRightIcon,
  UsersIcon,
  TvIcon,
} from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SubscribeForm } from "@/components/subscribe-form";
import { Metadata } from "next";
import type { Database } from "@/types/database";

type ConferenceRow = Database["public"]["Tables"]["conferences"]["Row"];

export async function generateMetadata({
  params,
}: {
  params: { "church-slug": string };
}): Promise<Metadata> {
  const adminClient = createAdminClient();
  const { data: church } = await adminClient
    .from("churches")
    .select("*")
    .eq("slug", params["church-slug"])
    .single();

  if (!church) {
    return { title: "Church Not Found" };
  }

  const title = `${church.name} | Bent Planet`;
  const description = church.bio || `Welcome to ${church.name}'s digital ministry hub on Bent Planet. Join our upcoming conferences and live streams.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      siteName: "Bent Planet",
      images: church.banner_url ? [
        {
          url: church.banner_url,
          width: 1200,
          height: 630,
          alt: `${church.name} Cover`,
        }
      ] : church.logo_url ? [
        {
          url: church.logo_url,
          width: 800,
          height: 800,
          alt: `${church.name} Logo`,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: church.banner_url ? [church.banner_url] : [],
    },
  };
}

export default async function ChurchPublicProfilePage({
  params,
}: {
  params: { "church-slug": string };
}) {
  const adminClient = createAdminClient();

  const { data: church, error: churchError } = await adminClient
    .from("churches")
    .select("*")
    .eq("slug", params["church-slug"])
    .maybeSingle();

  if (churchError || !church) {
    notFound();
  }

  // Fetch all published conferences for this church
  const { data: conferences } = await adminClient
    .from("conferences")
    .select("*")
    .eq("church_id", church.id)
    .eq("status", "published")
    .order("conference_date", { ascending: true });

  const typedConferences = (conferences || []) as ConferenceRow[];

  // Find upcoming vs past conferences
  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingConferences = typedConferences.filter((c) => !c.conference_date || c.conference_date >= todayStr);

  const featuredConference = upcomingConferences[0] || typedConferences[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link href={`/c/${church.slug}`} className="flex items-center gap-3">
            {church.logo_url ? (
              <Image
                src={church.logo_url}
                alt={church.name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-white text-sm">
                {church.name.charAt(0)}
              </div>
            )}
            <span className="font-heading text-lg font-bold tracking-tight text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {church.name}
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {featuredConference && (
              <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs">
                <Link href={`/c/${church.slug}/${featuredConference.slug}`}>
                  Next Live Event
                  <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Cover Banner */}
      <section className="relative w-full overflow-hidden bg-slate-950">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          {church.banner_url ? (
            <Image
              src={church.banner_url}
              alt={church.name}
              fill
              className="object-cover opacity-60"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 opacity-90" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Profile Card Overlay */}
        <div className="container relative mx-auto -mt-24 sm:-mt-28 max-w-7xl px-4 sm:px-8 pb-10 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              {church.logo_url ? (
                <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl border-4 border-slate-950 bg-white overflow-hidden shadow-2xl shrink-0">
                  <Image
                    src={church.logo_url}
                    alt={church.name}
                    width={144}
                    height={144}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-3xl border-4 border-slate-950 bg-indigo-600 text-4xl sm:text-5xl font-bold text-white shadow-2xl shrink-0">
                  {church.name.charAt(0)}
                </div>
              )}

              <div className="space-y-2 text-white pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md border border-indigo-500/30">
                    <SparklesIcon className="h-3 w-3 text-amber-300" /> Verified Ministry Hub
                  </span>
                  {church.country && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                      <GlobeIcon className="h-3 w-3" /> {church.country}
                    </span>
                  )}
                </div>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">
                  {church.name}
                </h1>
                <p className="max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                  {church.bio || "Welcome to our ministry home on Bent Planet. Join us live for life-changing conferences and messages."}
                </p>
              </div>
            </div>

            {/* Social Channels & Icons */}
            <div className="flex flex-wrap items-center gap-2.5 pb-2">
              {church.instagram_url && (
                <a
                  href={church.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  className="rounded-full border border-white/20 bg-white/10 p-2.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/30 hover:scale-105 transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {church.youtube_url && (
                <a
                  href={church.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube"
                  className="rounded-full border border-white/20 bg-white/10 p-2.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/30 hover:scale-105 transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
              )}
              {church.facebook_url && (
                <a
                  href={church.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  className="rounded-full border border-white/20 bg-white/10 p-2.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/30 hover:scale-105 transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
                </a>
              )}
              {church.whatsapp_channel_url && (
                <a
                  href={church.whatsapp_channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-3.255 0-6.241-1.312-8.423-3.44l-1.028 3.753 3.844-1.008c-2.193-2.146-3.535-5.116-3.535-8.406 0-6.617 5.383-12 12-12s12 5.383 12 12-5.383 12-12 12"/></svg>
                  WhatsApp Channel
                </a>
              )}
              {(church.whatsapp_group_url || church.whatsapp_url) && (
                <a
                  href={(church.whatsapp_group_url || church.whatsapp_url)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-emerald-400/50 bg-emerald-950/60 px-3.5 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-900 transition shadow-sm flex items-center gap-1.5"
                >
                  WhatsApp Group
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-8 py-12 space-y-16">
        {/* Featured Conference Highlight (If available) */}
        {featuredConference && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-indigo-600" /> Featured Upcoming Conference
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl">
              <div className="grid lg:grid-cols-2 gap-8 items-center p-6 sm:p-10">
                <div className="space-y-5">
                  <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/30 text-xs px-3 py-1 font-semibold uppercase tracking-wider">
                    {featuredConference.theme || "SPECIAL GATHERING"}
                  </Badge>

                  <h3 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                    {featuredConference.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3">
                    {featuredConference.caption || featuredConference.full_description || "Join us online for this extraordinary time in God's presence."}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-300 pt-2">
                    {featuredConference.conference_date && (
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-4 w-4 text-indigo-400" />
                        <span>{new Date(featuredConference.conference_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                      </div>
                    )}
                    {featuredConference.conference_time && (
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="h-4 w-4 text-indigo-400" />
                        <span>{featuredConference.conference_time} {featuredConference.timezone || ""}</span>
                      </div>
                    )}
                    {featuredConference.speaker_name && (
                      <div className="flex items-center gap-1.5">
                        <UsersIcon className="h-4 w-4 text-indigo-400" />
                        <span>Speaker: {featuredConference.speaker_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex flex-wrap gap-3">
                    <Button asChild size="lg" className="bg-white text-indigo-950 hover:bg-slate-100 font-bold shadow-md">
                      <Link href={`/c/${church.slug}/${featuredConference.slug}`}>
                        Register Free Online
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  {featuredConference.banner_url ? (
                    <Image
                      src={featuredConference.banner_url}
                      alt={featuredConference.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-indigo-950/50 p-6 text-center text-indigo-200">
                      <TvIcon className="h-16 w-16 opacity-40" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Conferences Showcase */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">
                All Ministry Events
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Explore our upcoming conferences, live broadcasts, and replays.</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {typedConferences.length} Events
            </span>
          </div>

          {typedConferences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typedConferences.map((conf) => (
                <Link
                  href={`/c/${church.slug}/${conf.slug}`}
                  key={conf.id}
                  className="group block h-full"
                >
                  <Card className="h-full overflow-hidden border-slate-200/80 bg-white shadow-xs hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 rounded-3xl flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                        {conf.banner_url ? (
                          <Image
                            src={conf.banner_url}
                            alt={conf.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center text-white/50">
                            <VideoIcon className="h-12 w-12 opacity-30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/95 text-slate-900 font-semibold text-[11px] backdrop-blur-md shadow-xs border-none">
                            {conf.theme || "Conference"}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          <span>
                            {conf.conference_date
                              ? new Date(conf.conference_date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Upcoming"}
                            {conf.conference_time ? ` · ${conf.conference_time}` : ""}
                          </span>
                        </div>

                        <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {conf.title}
                        </h3>

                        {conf.speaker_name && (
                          <p className="text-xs text-slate-600 font-medium">
                            Speaker: <strong className="text-slate-900">{conf.speaker_name}</strong>
                          </p>
                        )}

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {conf.caption || conf.full_description || "Join us online for this powerful event."}
                        </p>
                      </CardContent>
                    </div>

                    <div className="px-6 pb-6 pt-0">
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700 pt-3 border-t border-slate-100">
                        <span>View Details & Register</span>
                        <ArrowRightIcon className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs space-y-3">
              <TvIcon className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="font-heading text-lg font-bold text-slate-900">No conferences scheduled yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Check back soon or join our church updates below to receive invitations when new conferences launch.
              </p>
            </div>
          )}
        </section>

        {/* Church Community Subscribe Box */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                Direct Ministry Updates
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                Stay Connected with {church.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive notifications when we go live, download sermon study guides, and get invitations to upcoming conferences directly in your inbox.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <SubscribeForm churchId={church.id} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {church.name}. All rights reserved.</p>
          <p className="flex items-center gap-1 font-medium">
            Powered by{" "}
            <Link href="/" className="font-bold text-slate-900 hover:text-indigo-600 transition">
              Bent Planet
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
