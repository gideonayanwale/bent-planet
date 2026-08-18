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

              {/* WhatsApp Group & Channel Quick Join CTAs */}
              {((conference.whatsapp_group_url || church?.whatsapp_group_url) || (conference.whatsapp_channel_url || church?.whatsapp_channel_url) || church?.whatsapp_number) && (
                <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    <h4 className="text-lg font-bold font-heading">Connect on WhatsApp</h4>
                  </div>
                  <p className="text-xs text-emerald-200">
                    Get instant updates, reminder alerts, and direct contact with conference coordinators.
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {(conference.whatsapp_group_url || church?.whatsapp_group_url) && (
                      <Button asChild size="sm" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold justify-center gap-2 text-xs">
                        <a href={(conference.whatsapp_group_url || church?.whatsapp_group_url)!} target="_blank" rel="noopener noreferrer">
                          Join WhatsApp Group for Updates
                        </a>
                      </Button>
                    )}

                    {(conference.whatsapp_channel_url || church?.whatsapp_channel_url) && (
                      <Button asChild size="sm" variant="outline" className="w-full border-emerald-400/50 text-white hover:bg-emerald-800 justify-center gap-2 text-xs">
                        <a href={(conference.whatsapp_channel_url || church?.whatsapp_channel_url)!} target="_blank" rel="noopener noreferrer">
                          Follow Official WhatsApp Channel
                        </a>
                      </Button>
                    )}

                    {church?.whatsapp_number && (
                      <Button asChild size="sm" variant="ghost" className="w-full text-emerald-200 hover:text-white hover:bg-emerald-800/60 justify-center gap-2 text-xs">
                        <a
                          href={`https://wa.me/${church.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hi, I want to register for ${conference.title} starting on ${conference.conference_date || "the scheduled date"}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Register via WhatsApp Chat
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Church Info Card & Social Icons */}
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

                {/* Social Links Icons */}
                <div className="flex items-center gap-3 mb-6 pt-4 border-t border-slate-800">
                  {church?.instagram_url && (
                    <a href={church.instagram_url} target="_blank" rel="noopener noreferrer" title="Instagram" className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  )}
                  {church?.facebook_url && (
                    <a href={church.facebook_url} target="_blank" rel="noopener noreferrer" title="Facebook" className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-blue-600 transition">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
                    </a>
                  )}
                  {church?.youtube_url && (
                    <a href={church.youtube_url} target="_blank" rel="noopener noreferrer" title="YouTube" className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-red-600 transition">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    </a>
                  )}
                  {(church?.whatsapp_channel_url || conference.whatsapp_channel_url) && (
                    <a href={(conference.whatsapp_channel_url || church?.whatsapp_channel_url)!} target="_blank" rel="noopener noreferrer" title="WhatsApp Channel" className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-emerald-600 transition">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-3.255 0-6.241-1.312-8.423-3.44l-1.028 3.753 3.844-1.008c-2.193-2.146-3.535-5.116-3.535-8.406 0-6.617 5.383-12 12-12s12 5.383 12 12-5.383 12-12 12"/></svg>
                    </a>
                  )}
                </div>

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
