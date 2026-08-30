import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPublicConference } from "@/lib/conferences";
import { createAdminClient } from "@/lib/supabase/admin";
import { SubscribeForm } from "@/components/subscribe-form";
import { StreamPlayer } from "@/components/stream-player";
import { getThemeConfig } from "@/lib/theme-config";
import {
  CalendarIcon,
  ClockIcon,
  VideoIcon,
  DownloadIcon,
  UsersIcon,
  SparklesIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

interface AgendaItem {
  time?: string;
  title?: string;
  description?: string;
}

export async function generateMetadata({
  params,
}: {
  params: { "church-slug": string; "conference-slug": string };
}): Promise<Metadata> {
  const adminClient = createAdminClient();
  const conference = await getPublicConference(
    adminClient,
    params["church-slug"],
    params["conference-slug"]
  );

  if (!conference) {
    return { title: "Conference Not Found" };
  }

  const church = conference.churches;
  const title = `${conference.title} | ${church?.name}`;
  const description = conference.caption || conference.full_description || `Join ${church?.name} for ${conference.title}.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: church?.name || "Bent Planet",
      images: conference.banner_url ? [
        {
          url: conference.banner_url,
          width: 1200,
          height: 630,
          alt: conference.title,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: conference.banner_url ? [conference.banner_url] : [],
    },
  };
}

export default async function PublicConferencePage({
  params,
}: {
  params: { "church-slug": string; "conference-slug": string };
}) {
  const adminClient = createAdminClient();
  const conference = await getPublicConference(
    adminClient,
    params["church-slug"],
    params["conference-slug"]
  );

  if (!conference) {
    notFound();
  }

  const church = conference.churches;
  const agenda = (conference.agenda as unknown as AgendaItem[]) || [];
  const theme = getThemeConfig(conference.template_id);
  const subscriberCount = conference.subscribers?.[0]?.count || 0;

  // Coordinator WhatsApp RSVP Phone
  const coordinatorPhone = conference.whatsapp_contact_number || church?.whatsapp_number;
  const coordinatorCleanNumber = coordinatorPhone ? coordinatorPhone.replace(/[^0-9]/g, "") : null;
  const hostDisplayName = conference.host_name || church?.admin_name || church?.name || "Coordinator";
  const startDateStr = conference.conference_date
    ? new Date(conference.conference_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "TBA";

  const prefilledWhatsappMsg = encodeURIComponent(
    `Hi ${hostDisplayName}, I want to register for ${conference.title} starting on ${startDateStr}.`
  );

  return (
    <div className={`min-h-screen ${theme.pageBg} ${theme.pageText} selection:bg-indigo-500 selection:text-white flex flex-col justify-between`}>
      <div>
        {/* Top Mini Header */}
        <header className={`sticky top-0 z-40 w-full border-b ${theme.footerBorder} ${theme.footerBg}/90 backdrop-blur-md`}>
          <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8">
            <Link href={`/c/${church?.slug}`} className="flex items-center gap-2.5 hover:opacity-85 transition">
              {church?.logo_url ? (
                <Image
                  src={church.logo_url}
                  alt={church.name || "Church"}
                  width={30}
                  height={30}
                  className="h-7 w-7 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${theme.ctaBg} font-bold text-white text-xs`}>
                  {church?.name?.charAt(0) || "C"}
                </div>
              )}
              <span className={`font-heading text-xs sm:text-sm font-bold ${theme.headingText} truncate`}>
                {church?.name}
              </span>
            </Link>

            <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
              <Link href={`/c/${church?.slug}`}>All Church Events</Link>
            </Button>
          </div>
        </header>

        {/* Dynamic Cover Banner Section */}
        <div className={`relative w-full h-[45vh] min-h-[360px] lg:h-[55vh] flex items-center justify-center overflow-hidden ${theme.heroBg}`}>
          {conference.banner_url ? (
            <Image
              src={conference.banner_url}
              alt={conference.title}
              fill
              className="object-cover absolute inset-0 z-0 opacity-70"
              priority
            />
          ) : (
            <div className={`absolute inset-0 ${theme.heroFallbackGradient} z-0`} />
          )}

          <div className={`absolute inset-0 ${theme.heroOverlay} z-10`} />

          <div className="container relative z-20 flex flex-col items-center justify-end h-full pb-12 text-center text-white px-4">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <span className={`px-3.5 py-1 text-xs font-bold tracking-widest uppercase rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
                {conference.event_type || "CONFERENCE"}
              </span>
              {conference.theme && (
                <span className="px-3.5 py-1 text-xs font-semibold rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  {conference.theme}
                </span>
              )}
            </div>

            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl ${theme.fontHeading} mb-3 drop-shadow-2xl text-white`}>
              {conference.title}
            </h1>

            <p className="text-sm md:text-lg text-slate-200 max-w-2xl font-light">
              Presented by <strong className="font-semibold text-white">{church?.name}</strong>
              {conference.host_name ? ` · Host: ${conference.host_name}` : ""}
            </p>
          </div>
        </div>

        <div className="container py-12 lg:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
          {/* Livestream Player & Countdown Viewport */}
          <div className="mb-16">
            <StreamPlayer
              streamUrl={conference.stream_url}
              conferenceDate={conference.conference_date}
              conferenceTime={conference.conference_time}
              enableReplay={conference.enable_replay}
            />
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
            {/* Main Content Area */}
            <div className="space-y-12">
              {/* Description */}
              <div className={`${theme.cardBg} ${theme.cardBorder} border p-8 sm:p-10 rounded-3xl ${theme.cardShadow}`}>
                <h2 className={`text-2xl font-bold ${theme.fontHeading} ${theme.headingText} mb-4 flex items-center gap-2`}>
                  <SparklesIcon className={`h-5 w-5 ${theme.accentColor}`} /> About This Gathering
                </h2>
                <p className={`${theme.cardSubtext} leading-relaxed whitespace-pre-wrap text-sm sm:text-base font-sans`}>
                  {conference.full_description || conference.caption || "Join us online for this extraordinary time in God's presence."}
                </p>
              </div>

              {/* Free Resource Card */}
              {conference.free_resource_url && (
                <div className={`${theme.accentDark} text-white rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6`}>
                  <div className="space-y-1">
                    <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/20 rounded-full text-white/80">
                      FREE STUDY GUIDE & NOTES
                    </span>
                    <h3 className="text-xl font-bold font-heading mt-2">
                      {conference.free_resource_name || "Conference Study Guide & Notes"}
                    </h3>
                    <p className="text-xs text-white/70">Download the companion study material for attendees.</p>
                  </div>
                  <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-100 flex items-center gap-2 font-bold shadow-md text-xs">
                    <a href={conference.free_resource_url} target="_blank" rel="noreferrer">
                      <DownloadIcon className="w-4 h-4" />
                      Download Free Resource
                    </a>
                  </Button>
                </div>
              )}

              {/* Speaker Section */}
              {conference.speaker_name && (
                <div className={`${theme.cardBg} rounded-3xl p-8 sm:p-10 ${theme.cardShadow} border ${theme.cardBorder} space-y-3`}>
                  <h3 className={`text-xl font-bold ${theme.fontHeading} ${theme.headingText} flex items-center gap-2`}>
                    <UsersIcon className={`h-5 w-5 ${theme.accentColor}`} /> Featured Minister / Speaker
                  </h3>
                  <p className={`text-lg font-bold ${theme.accentColor} font-heading`}>{conference.speaker_name}</p>
                  <p className={`${theme.cardSubtext} leading-relaxed text-sm font-sans`}>
                    {conference.speaker_bio || `Ministering the Word of God with revelation and divine power at ${conference.title}.`}
                  </p>
                </div>
              )}

              {/* Agenda Section */}
              {agenda.length > 0 && (
                <div className="space-y-6">
                  <h3 className={`text-xl font-bold ${theme.fontHeading} ${theme.headingText}`}>Event Agenda</h3>
                  <div className="space-y-4">
                    {agenda.map((item, i) => (
                      <div key={i} className={`flex flex-col sm:flex-row gap-4 sm:gap-6 ${theme.cardBg} p-6 rounded-2xl border ${theme.cardBorder} ${theme.cardShadow}`}>
                        <div className="sm:w-28 shrink-0 pt-0.5">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full ${theme.accentLight} ${theme.accentColor} font-mono font-bold text-xs border ${theme.cardBorder}`}>
                            {item.time}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-base font-bold ${theme.cardText} mb-1`}>{item.title}</h4>
                          <p className={`${theme.cardSubtext} text-xs`}>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Sidebar */}
            <div className="relative">
              <div className="sticky top-20 space-y-6">
                {/* Reserve Spot Box */}
                <div className={`${theme.sidebarBg} rounded-3xl p-6 sm:p-8 shadow-xl border ${theme.sidebarBorder} relative overflow-hidden`}>
                  <h3 className={`text-xl font-bold ${theme.fontHeading} ${theme.sidebarText} mb-5`}>
                    Reserve Your Free Spot
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <CalendarIcon className={`w-4 h-4 ${theme.accentColor} shrink-0 mt-0.5`} />
                      <div>
                        <p className={`text-[11px] font-bold text-slate-400 uppercase tracking-wider`}>Date</p>
                        <p className={`text-xs font-semibold ${theme.sidebarText}`}>
                          {conference.conference_date
                            ? new Date(conference.conference_date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "TBA"}
                          {conference.end_date && conference.end_date !== conference.conference_date
                            ? ` — ${new Date(conference.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <ClockIcon className={`w-4 h-4 ${theme.accentColor} shrink-0 mt-0.5`} />
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Time</p>
                        <p className={`text-xs font-semibold ${theme.sidebarText}`}>
                          {conference.conference_time || "TBA"} {conference.timezone || ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <VideoIcon className={`w-4 h-4 ${theme.accentColor} shrink-0 mt-0.5`} />
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Format</p>
                        <p className={`text-xs font-semibold ${theme.sidebarText}`}>Online Interactive Livestream</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100/20">
                    {/* RSVP Limit Display */}
                    {conference.rsvp_limit ? (
                      <div className="mb-6 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold font-mono">
                          <span className={theme.sidebarText}>RSVP CAPACITY</span>
                          <span className={`${theme.accentColor}`}>
                            {subscriberCount} / {conference.rsvp_limit}
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${theme.accentBg} transition-all duration-1000 ease-out`}
                            style={{ width: `${Math.min(100, Math.max(0, (subscriberCount / (conference.rsvp_limit as number)) * 100))}%` }}
                          />
                        </div>
                        {subscriberCount >= (conference.rsvp_limit as number) ? (
                          <p className="text-[11px] text-rose-500 font-bold uppercase tracking-wide mt-1">Registration Full</p>
                        ) : null}
                      </div>
                    ) : null}

                    {(!conference.rsvp_limit || subscriberCount < (conference.rsvp_limit as number)) ? (
                      <SubscribeForm churchId={church?.id || ""} conferenceId={conference.id} />
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-100 text-slate-500 text-center text-xs font-semibold">
                        We have reached maximum in-person capacity. Please join via livestream!
                      </div>
                    )}
                  </div>
                </div>

                {/* WhatsApp Community & Coordinator Box */}
                {(conference.whatsapp_group_url || church?.whatsapp_group_url || coordinatorCleanNumber) && (
                  <div className={`${theme.whatsappBg} text-white rounded-3xl p-6 shadow-xl space-y-3.5`}>
                    <div className="flex items-center gap-2">
                      <MessageCircleIcon className="h-5 w-5 text-emerald-400" />
                      <h4 className="text-base font-bold font-heading">WhatsApp Community</h4>
                    </div>
                    <p className={`text-xs ${theme.whatsappText} leading-relaxed`}>
                      Connect directly with fellow attendees and coordinators on WhatsApp.
                    </p>

                    <div className="space-y-2 pt-1">
                      {(conference.whatsapp_group_url || church?.whatsapp_group_url) && (
                        <Button asChild size="sm" className={`w-full ${theme.whatsappButtonBg} ${theme.whatsappButtonText} font-bold justify-center gap-2 text-xs shadow-md`}>
                          <a href={(conference.whatsapp_group_url || church?.whatsapp_group_url)!} target="_blank" rel="noopener noreferrer">
                            Join Event WhatsApp Group
                          </a>
                        </Button>
                      )}

                      {coordinatorCleanNumber && (
                        <Button asChild size="sm" variant="outline" className="w-full border-emerald-400/40 text-emerald-100 hover:bg-emerald-900/80 justify-center gap-2 text-xs">
                          <a
                            href={`https://wa.me/${coordinatorCleanNumber}?text=${prefilledWhatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Click to Chat with Coordinator
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Church Info Card */}
                <div className={`${theme.churchBoxBg} rounded-3xl p-6 text-white shadow-xl space-y-4`}>
                  <div className="flex items-center gap-3">
                    {church?.logo_url ? (
                      <Image
                        src={church.logo_url}
                        alt={church.name || "Church Logo"}
                        width={40}
                        height={40}
                        className="rounded-full bg-white p-0.5 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-600 font-bold flex items-center justify-center text-sm">
                        {church?.name?.charAt(0) || "C"}
                      </div>
                    )}
                    <div>
                      <h4 className={`text-base font-bold font-heading ${theme.churchBoxText}`}>{church?.name}</h4>
                      <p className={`text-[11px] ${theme.churchBoxSubtext}`}>{church?.country || "Global Ministry"}</p>
                    </div>
                  </div>

                  <p className={`${theme.churchBoxSubtext} text-xs leading-relaxed`}>
                    {church?.bio || "Join us as we explore faith, worship, and build community online."}
                  </p>

                  <div className={`pt-2 border-t border-white/10`}>
                    <Link
                      href={`/c/${church?.slug}`}
                      className="text-xs font-semibold text-indigo-400 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span>Explore all events by {church?.name}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standardized Public Footer */}
      <footer className={`border-t ${theme.footerBorder} ${theme.footerBg} py-8 text-center text-xs ${theme.footerText}`}>
        <div className="container mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {church?.name}. All rights reserved.</p>
          <Link href="/" className="hover:text-indigo-600 transition font-medium">
            &copy; Bent Planet Inc. {new Date().getFullYear()}
          </Link>
        </div>
      </footer>
    </div>
  );
}
