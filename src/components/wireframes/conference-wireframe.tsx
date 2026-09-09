"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  VideoIcon,
  SparklesIcon,
  UsersIcon,
  DownloadIcon,
  MessageCircleIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  HeartIcon,
  Share2Icon,
  ShieldCheckIcon,
  RadioIcon,
  BookOpenIcon,
  FlameIcon,
  AwardIcon,
  CheckIcon,
  HelpCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WireframePresetId,
  WireframeBlockType,
  WireframeSlotData,
  WIREFRAME_PRESETS,
  getWireframePreset,
} from "@/lib/wireframe-config";
import { getThemeConfig, TemplateId } from "@/lib/theme-config";

interface ConferenceWireframeProps {
  presetId: WireframePresetId;
  templateId?: TemplateId;
  slotData: WireframeSlotData;
  activeBlocks?: WireframeBlockType[];
  isInteractivePreview?: boolean;
  onBlockSelect?: (blockId: WireframeBlockType) => void;
  selectedBlockId?: WireframeBlockType | null;
  churchId?: string;
  conferenceId?: string;
}

export function ConferenceWireframe({
  presetId,
  templateId,
  slotData,
  activeBlocks,
  isInteractivePreview = false,
  onBlockSelect,
  selectedBlockId,
  churchId,
  conferenceId,
}: ConferenceWireframeProps) {
  const preset = getWireframePreset(presetId);
  const effectiveThemeId = templateId || preset.recommendedTheme;
  const theme = getThemeConfig(effectiveThemeId);

  const enabledBlocks = activeBlocks || preset.activeBlocks;
  const isBlockActive = (id: WireframeBlockType) => enabledBlocks.includes(id);

  // RSVP Form & interactions state
  const [registered, setRegistered] = useState(false);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeePhone, setAttendeePhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [prayedIds, setPrayedIds] = useState<string[]>([]);
  const [agendaFilter, setAgendaFilter] = useState<string>("all");
  const [downloadedPdf, setDownloadedPdf] = useState(false);

  const handlePray = (id: string) => {
    if (!prayedIds.includes(id)) {
      setPrayedIds([...prayedIds, id]);
    }
  };

  const handleDownloadPdf = () => {
    setDownloadedPdf(true);
    if (slotData.freeResource?.downloadUrl && slotData.freeResource.downloadUrl !== "#") {
      window.open(slotData.freeResource.downloadUrl, "_blank");
    }
    setTimeout(() => setDownloadedPdf(false), 3000);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeEmail) return;

    if (churchId) {
      setIsSubmitting(true);
      setRsvpError(null);
      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: attendeeName,
            email: attendeeEmail,
            phone: attendeePhone || undefined,
            churchId,
            conferenceId,
          }),
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setRegistered(true);
      } catch (err: unknown) {
        const error = err as Error;
        console.error("RSVP Submission Error:", error);
        setRsvpError(error.message || "Failed to complete RSVP. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // In interactive preview / templates showroom mode: simulate instant success
      setRegistered(true);
    }
  };

  const currentYear = new Date().getFullYear();

  // Helper for block inspector clicks
  const getBlockClasses = (blockId: WireframeBlockType) => {
    if (!isInteractivePreview) return "";
    const isSelected = selectedBlockId === blockId;
    return `relative transition-all duration-200 cursor-pointer ${
      isSelected
        ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950 rounded-2xl"
        : "hover:outline-dashed hover:outline-1 hover:outline-indigo-400/50 rounded-2xl"
    }`;
  };

  // Filtered agenda sessions
  const filteredAgenda = slotData.agenda.filter((item) => {
    if (agendaFilter === "all") return true;
    return item.trackCategory.toLowerCase() === agendaFilter.toLowerCase();
  });

  return (
    <div
      className={`w-full min-h-screen ${theme.pageBg} ${theme.pageText} font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 flex flex-col justify-between`}
    >
      <div>
        {/* =========================================================
            BLOCK: brand_nav (Fixed)
           ========================================================= */}
        {isBlockActive("brand_nav") && (
          <header
            onClick={() => onBlockSelect?.("brand_nav")}
            className={`sticky top-0 z-30 w-full border-b ${theme.footerBorder} ${theme.cardBg}/90 backdrop-blur-md ${getBlockClasses(
              "brand_nav"
            )}`}
          >
            <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${theme.ctaBg} font-bold text-white text-xs shadow-sm`}
                >
                  {slotData.churchName.charAt(0) || "C"}
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs sm:text-sm font-bold ${theme.headingText} truncate max-w-[200px] sm:max-w-none`}>
                    {slotData.churchName}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">Official Gathering Portal</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <RadioIcon className="w-3 h-3 animate-pulse" /> Verified Host
                </span>
                <Button size="sm" variant="outline" className="text-xs h-8">
                  Church Profile
                </Button>
              </div>
            </div>
          </header>
        )}

        {/* =========================================================
            BLOCK: hero_stage (Fixed)
           ========================================================= */}
        {isBlockActive("hero_stage") && (
          <section
            onClick={() => onBlockSelect?.("hero_stage")}
            className={`relative w-full overflow-hidden ${theme.heroBg} ${getBlockClasses("hero_stage")}`}
          >
            <div className={`absolute inset-0 ${theme.heroFallbackGradient} opacity-90`} />
            <div className={`absolute inset-0 ${theme.heroOverlay}`} />
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10 max-w-5xl mx-auto pt-14 pb-16 sm:pt-20 sm:pb-24 px-4 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
                  {slotData.eventTypeBadge}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center gap-1">
                  <SparklesIcon className="w-3 h-3 text-amber-300" />
                  {slotData.themeTagline}
                </span>
              </div>

              <h1
                className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 ${theme.fontHeading} drop-shadow-lg leading-tight`}
              >
                {slotData.conferenceTitle}
              </h1>

              <p className="text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal mb-6 leading-relaxed">
                {slotData.heroContextHeadline}
              </p>

              <div className="inline-flex flex-wrap items-center justify-center gap-4 px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-slate-300">
                <span>
                  Host: <strong className="text-white font-semibold">{slotData.hostName}</strong>
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-300 font-semibold">{slotData.conferenceDate}</span>
                <span className="text-slate-500">•</span>
                <span>{slotData.conferenceTime} ({slotData.timezone})</span>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            POLYMORPHIC MAIN CONTENT TOPOLOGY
           ========================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          {/* 1. BENTO APEX LAYOUT (12-COL DYNAMIC MODULAR GRID) */}
          {preset.layoutStyle === "bento" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Stream Dock (Col 1-8) */}
              {isBlockActive("stream_dock") && (
                <div
                  onClick={() => onBlockSelect?.("stream_dock")}
                  className={`md:col-span-8 ${getBlockClasses("stream_dock")}`}
                >
                  <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-3xl p-6 ${theme.cardShadow}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <RadioIcon className="w-4 h-4 text-rose-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                          Livestream & Replay Dock
                        </span>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
                        1080p HD Audio & Video
                      </span>
                    </div>

                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center border border-slate-800 text-center p-6">
                      <div className="w-16 h-16 rounded-full bg-rose-600/90 hover:bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-600/30 mb-3 cursor-pointer transition transform hover:scale-105">
                        <VideoIcon className="w-7 h-7 text-white ml-0.5" />
                      </div>
                      <h4 className="text-white font-bold text-sm sm:text-base mb-1">
                        Livestream Starts at {slotData.conferenceTime}
                      </h4>
                      <p className="text-slate-400 text-xs max-w-sm">
                        Stream player auto-unlocks when live. Bookmark this page or RSVP below to receive direct broadcast notifications.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sticky RSVP Card (Col 9-12) */}
              {isBlockActive("rsvp_sticky") && (
                <div
                  onClick={() => onBlockSelect?.("rsvp_sticky")}
                  className={`md:col-span-4 ${getBlockClasses("rsvp_sticky")}`}
                >
                  <div className={`${theme.sidebarBg} ${theme.sidebarBorder} border rounded-3xl p-6 ${theme.cardShadow} sticky top-20`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                        Registration
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                        100% Free
                      </span>
                    </div>

                    <h3 className={`text-xl font-bold ${theme.fontHeading} ${theme.sidebarText} mb-2`}>
                      Reserve Your Spot
                    </h3>
                    <p className="text-xs text-slate-400 mb-5">
                      Get immediate calendar invite, livestream access code, and the free companion notes.
                    </p>

                    {slotData.rsvpLimit && (
                      <div className="mb-5 space-y-1.5">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-400">Auditorium Capacity</span>
                          <span className="text-amber-400 font-bold">
                            {slotData.confirmedRsvps || 780} / {slotData.rsvpLimit}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.min(
                                100,
                                (((slotData.confirmedRsvps || 780) / slotData.rsvpLimit) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {rsvpError && (
                      <div className="p-3 mb-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs">
                        {rsvpError}
                      </div>
                    )}

                    {!registered ? (
                      <form onSubmit={handleRsvpSubmit} className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={attendeeName}
                            onChange={(e) => setAttendeeName(e.target.value)}
                            placeholder="Sister Grace / Brother Paul"
                            className="w-full h-9 rounded-xl bg-slate-800/80 border border-slate-700 px-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            value={attendeeEmail}
                            onChange={(e) => setAttendeeEmail(e.target.value)}
                            placeholder="grace@example.com"
                            className="w-full h-9 rounded-xl bg-slate-800/80 border border-slate-700 px-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">WhatsApp / Phone (Optional)</label>
                          <input
                            type="tel"
                            value={attendeePhone}
                            onChange={(e) => setAttendeePhone(e.target.value)}
                            placeholder="+1 234 567 8900"
                            className="w-full h-9 rounded-xl bg-slate-800/80 border border-slate-700 px-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className={`w-full ${theme.ctaBg} ${theme.ctaText} text-xs font-bold h-10 mt-2`}
                        >
                          {isSubmitting ? "Confirming Spot..." : "Confirm Free RSVP & Access"}
                        </Button>
                      </form>
                    ) : (
                      <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/40 text-center text-emerald-200 text-xs">
                        <CheckCircle2Icon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <strong className="block text-white font-semibold text-sm mb-1">You Are Confirmed!</strong>
                        Welcome to {slotData.conferenceTitle}. Check your email for direct access.
                      </div>
                    )}

                    {isBlockActive("whatsapp_community") && (
                      <div className="mt-5 pt-4 border-t border-slate-800">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(slotData.whatsapp.prefilledMessage)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
                        >
                          <MessageCircleIcon className="w-4 h-4 text-emerald-400" />
                          Chat with Coordinator on WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* About & Scripture Mandate (Col 1-7) */}
              {isBlockActive("about_mandate") && (
                <div
                  onClick={() => onBlockSelect?.("about_mandate")}
                  className={`md:col-span-7 ${getBlockClasses("about_mandate")}`}
                >
                  <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-3xl p-6 sm:p-8 ${theme.cardShadow}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <SparklesIcon className={`w-5 h-5 ${theme.accentColor}`} />
                      <h3 className={`text-xl font-bold ${theme.fontHeading} ${theme.headingText}`}>
                        Spiritual Mandate & Focus
                      </h3>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-950/30 border-l-4 border-indigo-500 mb-5">
                      <p className="text-xs sm:text-sm font-medium italic text-indigo-200">
                        {slotData.scriptureAnchor}
                      </p>
                    </div>

                    <p className={`${theme.cardSubtext} text-xs sm:text-sm leading-relaxed whitespace-pre-line`}>
                      {slotData.fullDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Speaker Spotlight (Col 8-12) */}
              {isBlockActive("ministers_roster") && (
                <div
                  onClick={() => onBlockSelect?.("ministers_roster")}
                  className={`md:col-span-5 ${getBlockClasses("ministers_roster")}`}
                >
                  <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-3xl p-6 sm:p-8 ${theme.cardShadow}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <UsersIcon className={`w-5 h-5 ${theme.accentColor}`} />
                      <h3 className={`text-xl font-bold ${theme.fontHeading} ${theme.headingText}`}>
                        Featured Minister
                      </h3>
                    </div>

                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-lg">
                        {slotData.speaker.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{slotData.speaker.name}</h4>
                        <p className="text-xs text-indigo-300">{slotData.speaker.title}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {slotData.speaker.callingBadges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    <p className={`${theme.cardSubtext} text-xs leading-relaxed`}>
                      {slotData.speaker.bio}
                    </p>
                  </div>
                </div>
              )}

              {/* Track-Blocked Agenda (Col 1-8) */}
              {isBlockActive("track_agenda") && (
                <div
                  onClick={() => onBlockSelect?.("track_agenda")}
                  className={`md:col-span-8 ${getBlockClasses("track_agenda")}`}
                >
                  <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-3xl p-6 sm:p-8 ${theme.cardShadow}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-2">
                        <ClockIcon className={`w-5 h-5 ${theme.accentColor}`} />
                        <h3 className={`text-xl font-bold ${theme.fontHeading} ${theme.headingText}`}>
                          Conference Schedule & Tracks
                        </h3>
                      </div>
                      <div className="flex gap-1">
                        {["all", "Worship", "Keynote", "Altar Call"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setAgendaFilter(cat)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                              agendaFilter === cat
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {filteredAgenda.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-600 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
                              {item.time}
                            </span>
                            <div>
                              <h5 className="text-sm font-bold text-white">{item.title}</h5>
                              <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                            {item.trackCategory}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Free Resource Card (Col 9-12) */}
              {isBlockActive("study_resource") && slotData.freeResource && (
                <div
                  onClick={() => onBlockSelect?.("study_resource")}
                  className={`md:col-span-4 ${getBlockClasses("study_resource")}`}
                >
                  <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 border border-indigo-700/50 shadow-xl text-white space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white">
                        FREE COMPANION
                      </span>
                      <BookOpenIcon className="w-5 h-5 text-indigo-300" />
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-white mb-1">{slotData.freeResource.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{slotData.freeResource.subtitle}</p>
                    </div>

                    <Button
                      size="sm"
                      onClick={handleDownloadPdf}
                      className="w-full bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-2"
                    >
                      {downloadedPdf ? (
                        <>
                          <CheckIcon className="w-3.5 h-3.5 text-emerald-600" /> Download Started!
                        </>
                      ) : (
                        <>
                          <DownloadIcon className="w-3.5 h-3.5" /> Download Companion PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Live Prayer & Intercession Wall (Col 1-12) */}
              {isBlockActive("prayer_wall") && slotData.prayerRequests && (
                <div
                  onClick={() => onBlockSelect?.("prayer_wall")}
                  className={`md:col-span-12 ${getBlockClasses("prayer_wall")}`}
                >
                  <div className={`${theme.cardBg} ${theme.cardBorder} border rounded-3xl p-6 sm:p-8 ${theme.cardShadow}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                      <div className="flex items-center gap-2">
                        <FlameIcon className="w-5 h-5 text-amber-500" />
                        <div>
                          <h3 className={`text-xl font-bold ${theme.fontHeading} ${theme.headingText}`}>
                            Live Prayer & Intercession Wall
                          </h3>
                          <p className="text-xs text-slate-400">
                            Join with intercessors lifting up prayer burdens across nations
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Post Prayer Request
                      </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {slotData.prayerRequests.map((prayer) => {
                        const hasPrayed = prayedIds.includes(prayer.id);
                        return (
                          <div
                            key={prayer.id}
                            className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center justify-between text-xs mb-2">
                                <strong className="text-white font-semibold">{prayer.name}</strong>
                                <span className="text-slate-400 text-[11px]">{prayer.location}</span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed italic">
                                “{prayer.requestText}”
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-xs">
                              <span className="text-[11px] text-amber-400 font-medium">
                                {prayer.prayedCount + (hasPrayed ? 1 : 0)} prayers offered
                              </span>
                              <button
                                onClick={() => handlePray(prayer.id)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                                  hasPrayed
                                    ? "bg-amber-500 text-slate-950 scale-105"
                                    : "bg-slate-700/60 text-slate-200 hover:bg-slate-700"
                                }`}
                              >
                                <HeartIcon className={`w-3.5 h-3.5 ${hasPrayed ? "fill-current" : ""}`} />
                                {hasPrayed ? "Prayed" : "I Prayed"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. CINEMATIC FIRE REVIVAL LAYOUT (FOCAL STAGE & HALO) */}
          {preset.layoutStyle === "cinematic" && (
            <div className="space-y-12 max-w-5xl mx-auto">
              {/* Wide Stream Viewport Centerpiece */}
              {isBlockActive("stream_dock") && (
                <div onClick={() => onBlockSelect?.("stream_dock")} className={getBlockClasses("stream_dock")}>
                  <div className="rounded-3xl p-1 bg-gradient-to-b from-amber-500/40 via-orange-600/20 to-transparent shadow-2xl">
                    <div className="rounded-[22px] bg-zinc-950 border border-amber-500/30 overflow-hidden p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FlameIcon className="w-5 h-5 text-amber-400 animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                            Prophetic Broadcast Viewport
                          </span>
                        </div>
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                          Live at {slotData.conferenceTime}
                        </span>
                      </div>

                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex flex-col items-center justify-center border border-zinc-800 text-center p-6 group">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-600/40 mb-4 cursor-pointer transition transform group-hover:scale-110">
                          <VideoIcon className="w-9 h-9 text-zinc-950 ml-1" />
                        </div>
                        <h3 className="text-white font-extrabold text-lg sm:text-2xl mb-1 drop-shadow-md">
                          {slotData.conferenceTitle}
                        </h3>
                        <p className="text-amber-200/80 text-xs sm:text-sm max-w-md">
                          Broadcast unlocks live. Connect with believers worldwide for the outpouring of signs and wonders.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Centered Spiritual Mandate */}
              {isBlockActive("about_mandate") && (
                <div onClick={() => onBlockSelect?.("about_mandate")} className={getBlockClasses("about_mandate")}>
                  <div className="text-center max-w-3xl mx-auto space-y-6">
                    <div className="inline-block p-5 rounded-3xl bg-amber-950/30 border border-amber-600/40 shadow-xl">
                      <p className="text-base sm:text-xl font-serif italic text-amber-200 leading-relaxed">
                        {slotData.scriptureAnchor}
                      </p>
                    </div>
                    <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                      {slotData.fullDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Split Ministers & Sticky RSVP */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {isBlockActive("ministers_roster") && (
                  <div onClick={() => onBlockSelect?.("ministers_roster")} className={getBlockClasses("ministers_roster")}>
                    <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 shadow-xl space-y-5">
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block">
                        Apostolic Vessel
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 text-2xl">
                          {slotData.speaker.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{slotData.speaker.name}</h4>
                          <p className="text-xs text-amber-300">{slotData.speaker.title}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {slotData.speaker.callingBadges.map((b, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-700/50">
                            {b}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{slotData.speaker.bio}</p>
                    </div>
                  </div>
                )}

                {isBlockActive("rsvp_sticky") && (
                  <div onClick={() => onBlockSelect?.("rsvp_sticky")} className={getBlockClasses("rsvp_sticky")}>
                    <div className="rounded-3xl bg-zinc-900/90 border border-amber-500/30 p-6 sm:p-8 shadow-xl space-y-5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                          Free RSVP Seat
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">100% Free</span>
                      </div>
                      {rsvpError && (
                        <div className="p-3 mb-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs">
                          {rsvpError}
                        </div>
                      )}

                      {!registered ? (
                        <form onSubmit={handleRsvpSubmit} className="space-y-3">
                          <input
                            type="text"
                            required
                            value={attendeeName}
                            onChange={(e) => setAttendeeName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 px-3 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
                          />
                          <input
                            type="email"
                            required
                            value={attendeeEmail}
                            onChange={(e) => setAttendeeEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 px-3 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
                          />
                          <input
                            type="tel"
                            value={attendeePhone}
                            onChange={(e) => setAttendeePhone(e.target.value)}
                            placeholder="Phone / WhatsApp (Optional)"
                            className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 px-3 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
                          />
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs h-10"
                          >
                            {isSubmitting ? "Confirming Registration..." : "Confirm Registration"}
                          </Button>
                        </form>
                      ) : (
                        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-center text-amber-200 text-xs">
                          Registration Confirmed! Prepare for glory.
                        </div>
                      )}

                      {isBlockActive("whatsapp_community") && (
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(slotData.whatsapp.prefilledMessage)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-center w-full py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition"
                        >
                          Join Revival WhatsApp Group
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Schedule & Prayer Wall */}
              {isBlockActive("track_agenda") && (
                <div onClick={() => onBlockSelect?.("track_agenda")} className={getBlockClasses("track_agenda")}>
                  <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-8 space-y-4">
                    <h3 className="text-xl font-bold text-amber-200">Revival Consecration Agenda</h3>
                    <div className="space-y-3">
                      {slotData.agenda.map((it, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between">
                          <div>
                            <span className="font-mono text-xs text-amber-400 font-bold block">{it.time}</span>
                            <span className="text-sm font-bold text-white">{it.title}</span>
                            <p className="text-xs text-zinc-400">{it.description}</p>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                            {it.trackCategory}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. CATHEDRAL SACRED EDITORIAL (SERENE LITURGICAL FLOW) */}
          {preset.layoutStyle === "editorial" && (
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Liturgical Illuminated Scripture Banner */}
              {isBlockActive("about_mandate") && (
                <div onClick={() => onBlockSelect?.("about_mandate")} className={getBlockClasses("about_mandate")}>
                  <div className="border-y-2 border-stone-300 dark:border-stone-800 py-10 text-center space-y-4">
                    <span className="text-xs font-serif uppercase tracking-widest text-stone-500 block">
                      The Scripture Mandate
                    </span>
                    <blockquote className="text-xl sm:text-3xl font-serif text-stone-900 dark:text-stone-100 italic max-w-2xl mx-auto leading-relaxed">
                      {slotData.scriptureAnchor}
                    </blockquote>
                    <div className="w-12 h-0.5 bg-stone-400 mx-auto" />
                    <p className="text-sm text-stone-600 dark:text-stone-300 max-w-xl mx-auto font-serif leading-relaxed">
                      {slotData.fullDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Liturgical Timeline with Vertical Markers */}
              {isBlockActive("track_agenda") && (
                <div onClick={() => onBlockSelect?.("track_agenda")} className={getBlockClasses("track_agenda")}>
                  <div className="p-8 rounded-3xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-6">
                    <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 text-center">
                      Order of Convocation
                    </h3>
                    <div className="space-y-6 relative border-l-2 border-stone-300 dark:border-stone-700 pl-6 ml-4">
                      {slotData.agenda.map((it, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-stone-500 border-2 border-stone-100 dark:border-stone-900" />
                          <span className="font-serif text-xs font-semibold text-stone-500 block">{it.time}</span>
                          <h4 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">{it.title}</h4>
                          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">{it.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Scholar / Minister Profile */}
              {isBlockActive("ministers_roster") && (
                <div onClick={() => onBlockSelect?.("ministers_roster")} className={getBlockClasses("ministers_roster")}>
                  <div className="border border-stone-200 dark:border-stone-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="w-20 h-20 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-serif text-2xl font-bold text-stone-700 dark:text-stone-200 shrink-0">
                      {slotData.speaker.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-serif uppercase tracking-widest text-stone-400">Theologian in Residence</span>
                      <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">{slotData.speaker.name}</h4>
                      <p className="text-xs text-stone-500 font-serif italic">{slotData.speaker.title}</p>
                      <p className="text-xs text-stone-600 dark:text-stone-400 pt-2 leading-relaxed">{slotData.speaker.bio}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Study Booklet Lead Magnet */}
              {isBlockActive("study_resource") && slotData.freeResource && (
                <div onClick={() => onBlockSelect?.("study_resource")} className={getBlockClasses("study_resource")}>
                  <div className="p-8 rounded-3xl bg-stone-900 text-stone-100 border border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Liturgical Companion</span>
                      <h4 className="text-lg font-serif font-bold">{slotData.freeResource.title}</h4>
                      <p className="text-xs text-stone-300">{slotData.freeResource.subtitle}</p>
                    </div>
                    <Button onClick={handleDownloadPdf} className="bg-stone-100 text-stone-950 hover:bg-stone-200 font-serif text-xs font-bold shrink-0">
                      <DownloadIcon className="w-4 h-4 mr-2" /> Download Syllabus
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. NEON SURGE KINETIC YOUTH LAYOUT (HIGH VOLTAGE PUNCHY CARDS) */}
          {preset.layoutStyle === "kinetic" && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <div className="grid md:grid-cols-12 gap-6 items-start">
                {/* Hero WhatsApp Community Banner (Col 1-12) */}
                {isBlockActive("whatsapp_community") && (
                  <div onClick={() => onBlockSelect?.("whatsapp_community")} className={`md:col-span-12 ${getBlockClasses("whatsapp_community")}`}>
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                      <div className="flex items-center gap-3">
                        <MessageCircleIcon className="w-8 h-8" />
                        <div>
                          <h4 className="font-extrabold text-base sm:text-lg uppercase tracking-tight">
                            Join the NextGen Movement on WhatsApp
                          </h4>
                          <p className="text-xs font-medium text-slate-900">
                            Connect with 500+ youth leaders and creatives for real-time updates and hype clips.
                          </p>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(slotData.whatsapp.prefilledMessage)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-900 text-lime-400 font-bold text-xs uppercase tracking-wider shrink-0 transition"
                      >
                        Join WhatsApp Group ⚡
                      </a>
                    </div>
                  </div>
                )}

                {/* Stream Dock (Col 1-8) */}
                {isBlockActive("stream_dock") && (
                  <div onClick={() => onBlockSelect?.("stream_dock")} className={`md:col-span-8 ${getBlockClasses("stream_dock")}`}>
                    <div className="rounded-3xl bg-gray-900 border-2 border-lime-400/50 p-6 shadow-2xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-lime-400 text-slate-950 uppercase tracking-widest">
                          ⚡ LIVE STREAM DOCK
                        </span>
                        <span className="font-mono text-xs text-lime-400 font-bold">{slotData.conferenceTime} EST</span>
                      </div>
                      <div className="aspect-video rounded-2xl bg-black border border-gray-800 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-lime-400 flex items-center justify-center text-slate-950 mb-3 shadow-lg shadow-lime-400/30 cursor-pointer hover:scale-105 transition">
                          <VideoIcon className="w-8 h-8" />
                        </div>
                        <h4 className="text-white font-extrabold text-lg">{slotData.conferenceTitle}</h4>
                        <p className="text-gray-400 text-xs mt-1">High-energy youth worship & tech breakouts</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instant Youth RSVP (Col 9-12) */}
                {isBlockActive("rsvp_sticky") && (
                  <div onClick={() => onBlockSelect?.("rsvp_sticky")} className={`md:col-span-4 ${getBlockClasses("rsvp_sticky")}`}>
                    <div className="rounded-3xl bg-gray-900 border border-gray-800 p-6 space-y-4">
                      <span className="text-xs font-mono uppercase tracking-wider text-lime-400 font-bold">1-Click Youth Pass</span>
                      <h4 className="text-xl font-extrabold text-white">Grab Your Free Badge</h4>
                      {slotData.rsvpLimit && (
                        <div>
                          <div className="flex justify-between text-xs font-mono text-gray-400 mb-1">
                            <span>Campus Capacity</span>
                            <span className="text-lime-400 font-bold">82% Claimed</span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="w-4/5 h-full bg-lime-400" />
                          </div>
                        </div>
                      )}
                      {rsvpError && (
                        <div className="p-3 mb-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs">
                          {rsvpError}
                        </div>
                      )}
                      {!registered ? (
                        <form onSubmit={handleRsvpSubmit} className="space-y-3">
                          <input
                            type="text"
                            required
                            value={attendeeName}
                            onChange={(e) => setAttendeeName(e.target.value)}
                            placeholder="Your Name / Handle"
                            className="w-full h-10 rounded-xl bg-gray-950 border border-gray-800 px-3 text-xs text-white focus:border-lime-400"
                          />
                          <input
                            type="email"
                            required
                            value={attendeeEmail}
                            onChange={(e) => setAttendeeEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full h-10 rounded-xl bg-gray-950 border border-gray-800 px-3 text-xs text-white focus:border-lime-400"
                          />
                          <input
                            type="tel"
                            value={attendeePhone}
                            onChange={(e) => setAttendeePhone(e.target.value)}
                            placeholder="WhatsApp Number (Optional)"
                            className="w-full h-10 rounded-xl bg-gray-950 border border-gray-800 px-3 text-xs text-white focus:border-lime-400"
                          />
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-lime-400 hover:bg-lime-300 text-slate-950 font-extrabold text-xs h-10"
                          >
                            {isSubmitting ? "Claiming Badge..." : "Claim Free Badge 🚀"}
                          </Button>
                        </form>
                      ) : (
                        <div className="p-4 rounded-xl bg-lime-950/60 border border-lime-400/40 text-center text-lime-300 text-xs font-bold">
                          Badge Claimed! Check your inbox.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. EXECUTIVE SUMMIT LAYOUT (KINGDOM GOVERNANCE & DOSSIER) */}
          {preset.layoutStyle === "executive" && (
            <div className="space-y-12 max-w-6xl mx-auto">
              <div className="grid md:grid-cols-12 gap-8 items-start">
                {/* Executive Dossier (Col 1-7) */}
                {isBlockActive("ministers_roster") && (
                  <div onClick={() => onBlockSelect?.("ministers_roster")} className={`md:col-span-7 ${getBlockClasses("ministers_roster")}`}>
                    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl space-y-6">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                        <AwardIcon className="w-4 h-4" /> Ministerial Dossier
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-serif text-2xl font-bold text-amber-300">
                          {slotData.speaker.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white font-heading">{slotData.speaker.name}</h3>
                          <p className="text-xs text-amber-300 font-semibold">{slotData.speaker.title}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {slotData.speaker.callingBadges.map((badge, idx) => (
                              <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{slotData.speaker.bio}</p>
                    </div>
                  </div>
                )}

                {/* Executive RSVP & VIP WhatsApp (Col 8-12) */}
                {isBlockActive("rsvp_sticky") && (
                  <div onClick={() => onBlockSelect?.("rsvp_sticky")} className={`md:col-span-5 ${getBlockClasses("rsvp_sticky")}`}>
                    <div className="rounded-3xl bg-slate-900 border border-amber-500/30 p-8 shadow-2xl space-y-5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                        Executive Delegate Pass
                      </span>
                      <h4 className="text-xl font-bold text-white font-heading">Register as Delegate</h4>
                      {rsvpError && (
                        <div className="p-3 mb-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs">
                          {rsvpError}
                        </div>
                      )}
                      {!registered ? (
                        <form onSubmit={handleRsvpSubmit} className="space-y-3">
                          <input
                            type="text"
                            required
                            value={attendeeName}
                            onChange={(e) => setAttendeeName(e.target.value)}
                            placeholder="Delegate Full Name & Title"
                            className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white placeholder-slate-500 focus:border-amber-500"
                          />
                          <input
                            type="email"
                            required
                            value={attendeeEmail}
                            onChange={(e) => setAttendeeEmail(e.target.value)}
                            placeholder="Official Email Address"
                            className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white placeholder-slate-500 focus:border-amber-500"
                          />
                          <input
                            type="tel"
                            value={attendeePhone}
                            onChange={(e) => setAttendeePhone(e.target.value)}
                            placeholder="Executive Phone / WhatsApp (Optional)"
                            className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 px-3 text-xs text-white placeholder-slate-500 focus:border-amber-500"
                          />
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs h-10"
                          >
                            {isSubmitting ? "Issuing Credential..." : "Confirm Executive Credential"}
                          </Button>
                        </form>
                      ) : (
                        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/40 text-center text-amber-200 text-xs font-semibold">
                          Executive Delegate Badge Issued!
                        </div>
                      )}

                      {isBlockActive("whatsapp_community") && (
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(slotData.whatsapp.prefilledMessage)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-center w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold transition"
                        >
                          VIP WhatsApp Council Link
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Multi-Track Governance Agenda */}
              {isBlockActive("track_agenda") && (
                <div onClick={() => onBlockSelect?.("track_agenda")} className={getBlockClasses("track_agenda")}>
                  <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-4">
                    <h4 className="text-xl font-bold text-white font-heading">Summit Plenary & Breakout Schedule</h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {slotData.agenda.map((it, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                          <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">{it.time}</span>
                          <h5 className="font-bold text-sm text-white">{it.title}</h5>
                          <p className="text-xs text-slate-400 line-clamp-2">{it.description}</p>
                          <span className="inline-block px-2 py-0.5 rounded-sm bg-slate-800 text-[10px] text-slate-300 font-mono">
                            {it.trackCategory}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. GRACE & FELLOWSHIP ORGANIC (FAMILY & WELCOMING ROUNDED FLOW) */}
          {preset.layoutStyle === "organic" && (
            <div className="space-y-10 max-w-5xl mx-auto">
              {/* Warm Welcome Scripture Card */}
              {isBlockActive("about_mandate") && (
                <div onClick={() => onBlockSelect?.("about_mandate")} className={getBlockClasses("about_mandate")}>
                  <div className="p-8 sm:p-10 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-4">
                    <span className="text-xs font-serif uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      Family Covenant Gathering
                    </span>
                    <blockquote className="text-xl sm:text-2xl font-serif italic text-emerald-900 dark:text-emerald-100 max-w-xl mx-auto">
                      {slotData.scriptureAnchor}
                    </blockquote>
                    <p className="text-sm text-stone-600 dark:text-stone-300 max-w-2xl mx-auto font-sans leading-relaxed">
                      {slotData.fullDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Grid with Study Companion & Family RSVP */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {isBlockActive("study_resource") && slotData.freeResource && (
                  <div onClick={() => onBlockSelect?.("study_resource")} className={getBlockClasses("study_resource")}>
                    <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                        Free Family Guide
                      </span>
                      <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                        {slotData.freeResource.title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {slotData.freeResource.subtitle}
                      </p>
                      <Button onClick={handleDownloadPdf} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs">
                        <DownloadIcon className="w-4 h-4 mr-2" /> Download Family Companion PDF
                      </Button>
                    </div>
                  </div>
                )}

                {isBlockActive("rsvp_sticky") && (
                  <div onClick={() => onBlockSelect?.("rsvp_sticky")} className={getBlockClasses("rsvp_sticky")}>
                    <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Family Fellowship RSVP
                      </span>
                      <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                        Reserve Family Seating
                      </h4>
                      {rsvpError && (
                        <div className="p-3 mb-3 rounded-xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 text-xs">
                          {rsvpError}
                        </div>
                      )}
                      {!registered ? (
                        <form onSubmit={handleRsvpSubmit} className="space-y-3">
                          <input
                            type="text"
                            required
                            value={attendeeName}
                            onChange={(e) => setAttendeeName(e.target.value)}
                            placeholder="Family Name / Parents"
                            className="w-full h-10 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 px-3 text-xs text-stone-900 dark:text-stone-100"
                          />
                          <input
                            type="email"
                            required
                            value={attendeeEmail}
                            onChange={(e) => setAttendeeEmail(e.target.value)}
                            placeholder="Contact Email"
                            className="w-full h-10 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 px-3 text-xs text-stone-900 dark:text-stone-100"
                          />
                          <input
                            type="tel"
                            value={attendeePhone}
                            onChange={(e) => setAttendeePhone(e.target.value)}
                            placeholder="Contact Phone / WhatsApp (Optional)"
                            className="w-full h-10 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 px-3 text-xs text-stone-900 dark:text-stone-100"
                          />
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-10"
                          >
                            {isSubmitting ? "Registering Family..." : "Confirm Family Seating"}
                          </Button>
                        </form>
                      ) : (
                        <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-center text-emerald-900 dark:text-emerald-200 text-xs font-semibold">
                          Your family is registered!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Community Prayer Wall */}
              {isBlockActive("prayer_wall") && slotData.prayerRequests && (
                <div onClick={() => onBlockSelect?.("prayer_wall")} className={getBlockClasses("prayer_wall")}>
                  <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
                    <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                      Fellowship Prayer Requests
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {slotData.prayerRequests.map((prayer) => {
                        const hasPrayed = prayedIds.includes(prayer.id);
                        return (
                          <div key={prayer.id} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/50 flex flex-col justify-between gap-2">
                            <p className="text-xs italic text-stone-700 dark:text-stone-300">“{prayer.requestText}”</p>
                            <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-700 text-xs">
                              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">{prayer.name} ({prayer.location})</span>
                              <button
                                onClick={() => handlePray(prayer.id)}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                                  hasPrayed ? "bg-emerald-600 text-white" : "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200"
                                }`}
                              >
                                <HeartIcon className={`w-3 h-3 ${hasPrayed ? "fill-current" : ""}`} />
                                {hasPrayed ? "Prayed" : "Pray"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          BLOCK: church_footer (Fixed)
         ========================================================= */}
      {isBlockActive("church_footer") && (
        <footer
          onClick={() => onBlockSelect?.("church_footer")}
          className={`w-full border-t ${theme.footerBorder} ${theme.footerBg} py-8 px-4 ${getBlockClasses(
            "church_footer"
          )}`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">{slotData.churchName}</span>
              <span>•</span>
              <span>All Rights Reserved</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <Link href="/" className="font-bold text-indigo-400 hover:underline">
                Bent Planet Inc. {currentYear}
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
