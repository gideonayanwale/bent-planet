import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPublicConference } from "@/lib/conferences";
import { createAdminClient } from "@/lib/supabase/admin";
import { SubscribeForm } from "@/components/subscribe-form";
import { StreamPlayer } from "@/components/stream-player";
import { CalendarIcon, ClockIcon, VideoIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgendaItem {
  time?: string;
  title?: string;
  description?: string;
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

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary/20">
      {/* Dynamic Banner Section */}
      <div className="relative w-full h-[45vh] min-h-[360px] lg:h-[60vh] flex items-center justify-center overflow-hidden">
        {conference.banner_url ? (
          <Image
            src={conference.banner_url}
            alt={conference.title}
            fill
            className="object-cover absolute inset-0 z-0"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 z-0" />
        )}
        
        {/* Dynamic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent z-10" />
        
        <div className="container relative z-20 flex flex-col items-center justify-end h-full pb-12 text-center text-white px-4">
          <span className="px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-indigo-300">
            {conference.theme || "SPECIAL EVENT"}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl font-heading mb-3 drop-shadow-2xl">
            {conference.title}
          </h1>
          <p className="text-base md:text-xl text-slate-200 max-w-2xl font-light">
            Hosted by <span className="font-semibold text-white">{church?.name}</span>
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
            <div className="prose prose-lg md:prose-xl prose-slate max-w-none bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold font-heading text-slate-900 mb-4">About the Conference</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-base sm:text-lg font-sans">
                {conference.full_description}
              </p>
            </div>

            {/* Free Resource Card */}
            {conference.free_resource_url && (
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/20 rounded-full text-indigo-200">
                    FREE EVENT GUIDE & NOTES
                  </span>
                  <h3 className="text-xl font-bold font-heading mt-2">{conference.free_resource_name || "Conference Study Guide & Notes"}</h3>
                  <p className="text-sm text-indigo-200">Download free material provided for attendees.</p>
                </div>
                <Button asChild size="lg" className="bg-white text-indigo-900 hover:bg-slate-100 flex items-center gap-2 font-semibold">
                  <a href={conference.free_resource_url} target="_blank" rel="noreferrer">
                    <DownloadIcon className="w-4 h-4" />
                    Download Free PDF
                  </a>
                </Button>
              </div>
            )}

            {/* Speaker Section */}
            {conference.speaker_name && (
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold font-heading mb-4 text-slate-900">Featured Speaker</h3>
                <div className="space-y-3">
                  <p className="text-xl font-bold text-indigo-600 font-heading">{conference.speaker_name}</p>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-sans">
                    {conference.speaker_bio}
                  </p>
                </div>
              </div>
            )}

            {/* Agenda Section */}
            {agenda.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-heading text-slate-900">Conference Agenda</h3>
                <div className="space-y-4">
                  {agenda.map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="sm:w-28 flex-shrink-0 pt-0.5">
                        <span className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-mono font-semibold text-xs border border-indigo-100">
                          {item.time}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                        <p className="text-slate-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="relative">
            <div className="sticky top-20 space-y-8">
              
              {/* Subscribe Box */}
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                <h3 className="text-2xl font-bold font-heading text-slate-900 mb-6">Reserve Your Spot</h3>
                
                <div className="space-y-5 mb-8">
                  <div className="flex items-start gap-3.5">
                    <CalendarIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</p>
                      <p className="text-sm font-medium text-slate-900">
                        {conference.conference_date
                          ? new Date(conference.conference_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                          : "TBA"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <ClockIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</p>
                      <p className="text-sm font-medium text-slate-900">{conference.conference_time || "TBA"} {conference.timezone || ""}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5">
                    <VideoIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</p>
                      <p className="text-sm font-medium text-slate-900">Online Livestream</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <SubscribeForm churchId={church?.id || ""} conferenceId={conference.id} />
                </div>
              </div>

              {/* Church Info Card */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-4">
                  {church?.logo_url && (
                    <Image src={church.logo_url} alt={church.name || "Church Logo"} width={48} height={48} className="rounded-full bg-white p-1" />
                  )}
                  <h4 className="text-xl font-bold font-heading">{church?.name}</h4>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {church?.bio || "Join us as we explore faith and build community."}
                </p>
                <Link href={`/c/${church?.slug}`} className="text-sm font-semibold text-indigo-400 hover:text-white transition-colors underline underline-offset-4">
                  View all conferences by {church?.name} →
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
