"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  SendIcon,
  SparklesIcon,
  CheckIcon,
  AlertCircleIcon,
  LayoutTemplateIcon,
  Loader2Icon,
  SmartphoneIcon,
  MonitorIcon,
  PaletteIcon,
  BookOpenIcon,
  Link2Icon,
  FlameIcon,
  MailIcon,
  EyeIcon,
  RotateCcwIcon,
} from "lucide-react";
import {
  EmailTemplatesGalleryModal,
} from "@/components/email-templates-gallery-modal";
import {
  EMAIL_THEME_PRESETS,
  RICH_EMAIL_TEMPLATES,
  type EmailThemeStyle,
  type EmailTemplateDefinition,
} from "@/lib/email-templates";

interface BroadcastEmailComposerProps {
  churchName: string;
  subscriberCount: number;
  isPremium?: boolean;
}

export function BroadcastEmailComposer({
  churchName,
  subscriberCount,
  isPremium = false,
}: BroadcastEmailComposerProps) {
  // Active Theme and Template
  const [themeStyle, setThemeStyle] = useState<EmailThemeStyle>("modern_indigo");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("conference-announcement");
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Email Field States
  const [badgeLabel, setBadgeLabel] = useState("CONFERENCE INVITATION");
  const [subject, setSubject] = useState(`📢 Announcing Our Upcoming Conference at ${churchName}!`);
  const [preheader, setPreheader] = useState("God has prepared an extraordinary time of breakthrough and empowerment for you.");
  const [greetingType, setGreetingType] = useState<"name" | "saints" | "fellowship" | "custom">("name");
  const [customGreeting, setCustomGreeting] = useState("Greetings in Christ");
  
  // Scripture callout
  const [enableScripture, setEnableScripture] = useState(true);
  const [scriptureVerse, setScriptureVerse] = useState(
    "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope."
  );
  const [scriptureReference, setScriptureReference] = useState("Jeremiah 29:11");

  // Body content
  const [bodyContent, setBodyContent] = useState(
    `We are overjoyed to invite you to our upcoming gathering at ${churchName}!\n\nExpect an atmospheric dimension of vibrant worship, revelatory teachings, and powerful ministrations designed to elevate your walk with God.\n\nSave your spot online today and invite your family, colleagues, and loved ones to join us online!`
  );

  // Primary CTA Button
  const [ctaText, setCtaText] = useState("Reserve Your Free Spot Now");
  const [ctaUrl, setCtaUrl] = useState(`https://bentplanet.com/c/events`);

  // Secondary link
  const [enableSecondaryLink, setEnableSecondaryLink] = useState(true);
  const [secondaryLinkText, setSecondaryLinkText] = useState("Join WhatsApp Community for Updates →");
  const [secondaryLinkUrl, setSecondaryLinkUrl] = useState("https://chat.whatsapp.com/...");

  // Preview Mode: 'desktop' | 'mobile'
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "mobile">("desktop");

  // Processing States
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const activeTheme = EMAIL_THEME_PRESETS[themeStyle] || EMAIL_THEME_PRESETS.modern_indigo;

  // Apply a selected template
  const applyTemplate = (template: EmailTemplateDefinition) => {
    setSelectedTemplateId(template.id);
    setThemeStyle(template.themeStyle);
    setBadgeLabel(template.badgeLabel);
    setSubject(template.subject(churchName));
    setPreheader(template.preheader);
    setGreetingType(template.greetingType);
    setBodyContent(template.body(churchName));
    setCtaText(template.ctaText);
    setCtaUrl(template.ctaUrlPlaceholder);

    if (template.scriptureQuote) {
      setEnableScripture(true);
      setScriptureVerse(template.scriptureQuote.verse);
      setScriptureReference(template.scriptureQuote.reference);
    } else {
      setEnableScripture(false);
    }

    if (template.includeSecondaryLink) {
      setEnableSecondaryLink(true);
      setSecondaryLinkText(template.secondaryLinkText || "Join Community Chat →");
    } else {
      setEnableSecondaryLink(false);
    }
  };

  const getGreetingText = () => {
    switch (greetingType) {
      case "name":
        return "Hello Sarah (Subscriber Name),";
      case "saints":
        return "Dear Saints & Beloved in Christ,";
      case "fellowship":
        return `Beloved Family & Friends of ${churchName},`;
      case "custom":
        return `${customGreeting},`;
      default:
        return "Hello Beloved,";
    }
  };

  // AI drafting handler
  const handleAIDraft = async (flavor?: "urgent" | "faith" | "general") => {
    setIsDrafting(true);
    setStatusMsg(null);

    let promptTopic = subject;
    if (flavor === "urgent") {
      promptTopic = `Urgent livestream starting now: ${subject}`;
    } else if (flavor === "faith") {
      promptTopic = `Powerful faith and healing ministration: ${subject}`;
    }

    try {
      const res = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: promptTopic || `Important Ministry Update from ${churchName}`,
          templateType: selectedTemplateId || "General Announcement",
          keyPoints: bodyContent || "",
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to generate AI draft.");
      }

      if (json.data) {
        setSubject(json.data.subject);
        setBodyContent(json.data.bodyContent);
        if (json.data.ctaText) setCtaText(json.data.ctaText);
        setStatusMsg({
          type: "success",
          text: `AI Copy drafted using ${json.data.providerUsed || "AI Engine"}${
            json.rateLimit?.remaining !== undefined
              ? ` (${json.rateLimit.remaining} hourly generation(s) remaining)`
              : ""
          }`,
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMsg({
        type: "error",
        text: error.message || "Failed to generate AI email copy.",
      });
    } finally {
      setIsDrafting(false);
    }
  };

  // Dispatch Broadcast Email
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !bodyContent) return;

    if (subscriberCount === 0) {
      alert("You have no active subscribers to send this broadcast to.");
      return;
    }

    if (!confirm(`Are you sure you want to dispatch this email broadcast to all ${subscriberCount} active subscribers?`)) {
      return;
    }

    setIsSending(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          bodyContent,
          ctaUrl: ctaUrl || null,
          ctaText: ctaText || null,
          themeStyle,
          badgeLabel: badgeLabel || null,
          preheader: preheader || null,
          scriptureVerse: enableScripture ? scriptureVerse : null,
          scriptureReference: enableScripture ? scriptureReference : null,
          secondaryLinkUrl: enableSecondaryLink ? secondaryLinkUrl : null,
          secondaryLinkText: enableSecondaryLink ? secondaryLinkText : null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({
          type: "success",
          text: `Broadcast email successfully queued and dispatched for ${data.count} subscriber(s)!`,
        });
      } else {
        setStatusMsg({
          type: "error",
          text: data.error || "Failed to dispatch broadcast email.",
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMsg({
        type: "error",
        text: error.message || "An unexpected error occurred while sending.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/40 border border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <LayoutTemplateIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Interactive Email Designer</h3>
            <p className="text-xs text-muted-foreground">
              Customize your broadcast with real-time visual preview across desktop and mobile screens.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowGalleryModal(true)}
            className="text-xs font-semibold gap-1.5 bg-background shadow-xs hover:border-primary/50"
          >
            <LayoutTemplateIcon className="h-3.5 w-3.5 text-primary" />
            Template Gallery ({RICH_EMAIL_TEMPLATES.length})
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isDrafting}
            onClick={() => handleAIDraft()}
            className="text-xs font-semibold gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
          >
            {isDrafting ? (
              <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <SparklesIcon className="h-3.5 w-3.5 text-amber-500" />
            )}
            AI Copy Polish
          </Button>
        </div>
      </div>

      {/* Quick Template Switcher Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Quick Template Presets
          </label>
          <span className="text-[11px] text-primary font-semibold cursor-pointer hover:underline" onClick={() => setShowGalleryModal(true)}>
            View all with preview →
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {RICH_EMAIL_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => applyTemplate(tmpl)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedTemplateId === tmpl.id
                  ? "bg-primary text-primary-foreground shadow-xs scale-102"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              <span>{tmpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual-Pane Grid: Left = Editor Controls, Right = Live Visual Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: CUSTOMIZER CONTROLS (7 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* Theme Palette Bar */}
          <div className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <PaletteIcon className="h-3.5 w-3.5 text-primary" />
                Color Theme & Accent Tone
              </label>
              <span className="text-[11px] text-muted-foreground font-medium">{activeTheme.name}</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(Object.keys(EMAIL_THEME_PRESETS) as EmailThemeStyle[]).map((key) => {
                const preset = EMAIL_THEME_PRESETS[key];
                const isSelected = themeStyle === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setThemeStyle(key)}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs"
                        : "border-border hover:border-border/80 bg-background hover:bg-secondary/40"
                    }`}
                  >
                    <div
                      className="h-5 w-5 rounded-full shadow-xs border border-white/40"
                      style={{ background: preset.headerBg }}
                    />
                    <span className="text-[10px] font-bold text-foreground truncate max-w-full">
                      {preset.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content Inputs */}
          <form onSubmit={handleSend} className="space-y-5">
            {/* Header Badge & Pre-Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Header Badge Tag</label>
                <Input
                  type="text"
                  placeholder="e.g. 📢 SPECIAL ANNOUNCEMENT"
                  value={badgeLabel}
                  onChange={(e) => setBadgeLabel(e.target.value)}
                  className="text-xs bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Greeting Formula</label>
                <select
                  value={greetingType}
                  onChange={(e) => setGreetingType(e.target.value as any)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                >
                  <option value="name">Hello {"{Subscriber Name}"}</option>
                  <option value="saints">Dear Saints & Beloved</option>
                  <option value="fellowship">Beloved Family of {churchName}</option>
                  <option value="custom">Custom Salutation...</option>
                </select>
              </div>
            </div>

            {greetingType === "custom" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Custom Salutation</label>
                <Input
                  type="text"
                  placeholder="e.g. Grace and Peace to you"
                  value={customGreeting}
                  onChange={(e) => setCustomGreeting(e.target.value)}
                  className="text-xs bg-background"
                />
              </div>
            )}

            {/* Subject Line */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Email Subject Line *</span>
                <span className="text-[10px] text-muted-foreground font-mono">{subject.length}/100</span>
              </label>
              <Input
                type="text"
                required
                placeholder="Inspiring and clear subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-xs font-semibold bg-background"
              />
            </div>

            {/* Preheader Preview Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Preheader / Snippet Preview</label>
              <Input
                type="text"
                placeholder="Appears in user's inbox list right next to the subject..."
                value={preheader}
                onChange={(e) => setPreheader(e.target.value)}
                className="text-xs bg-background"
              />
            </div>

            {/* Scripture Callout Section */}
            <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <BookOpenIcon className="h-3.5 w-3.5 text-primary" />
                  Scripture Highlight Box
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={enableScripture}
                    onChange={(e) => setEnableScripture(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>Include verse callout</span>
                </label>
              </div>

              {enableScripture && (
                <div className="space-y-2 pt-1">
                  <Textarea
                    placeholder="Scripture verse text..."
                    value={scriptureVerse}
                    onChange={(e) => setScriptureVerse(e.target.value)}
                    className="text-xs bg-background resize-none h-16"
                  />
                  <Input
                    type="text"
                    placeholder="Reference (e.g. Isaiah 43:19)"
                    value={scriptureReference}
                    onChange={(e) => setScriptureReference(e.target.value)}
                    className="text-xs bg-background"
                  />
                </div>
              )}
            </div>

            {/* Body Content */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">Main Body Message *</label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={isDrafting}
                    onClick={() => handleAIDraft("faith")}
                    className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                  >
                    <SparklesIcon className="h-2.5 w-2.5" /> Faith Tone
                  </button>
                  <span className="text-muted-foreground">•</span>
                  <button
                    type="button"
                    disabled={isDrafting}
                    onClick={() => handleAIDraft("urgent")}
                    className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-0.5"
                  >
                    <FlameIcon className="h-2.5 w-2.5" /> Live Urgency
                  </button>
                </div>
              </div>
              <Textarea
                required
                placeholder="Write your email body message here... Supports paragraphs."
                value={bodyContent}
                onChange={(e) => setBodyContent(e.target.value)}
                className="text-xs bg-background font-sans leading-relaxed h-44 resize-y"
              />
            </div>

            {/* Primary Action Button Config */}
            <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Link2Icon className="h-3.5 w-3.5 text-primary" />
                Primary Action Call-to-Action (CTA)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">Button Label</label>
                  <Input
                    type="text"
                    placeholder="e.g. Join Livestream Broadcast"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="text-xs bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">Destination Link URL</label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="text-xs bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Secondary Community Link Config */}
            <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <MailIcon className="h-3.5 w-3.5 text-primary" />
                  Secondary Link (WhatsApp / Notes)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={enableSecondaryLink}
                    onChange={(e) => setEnableSecondaryLink(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>Enable link</span>
                </label>
              </div>

              {enableSecondaryLink && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <Input
                    type="text"
                    placeholder="e.g. Join WhatsApp Community"
                    value={secondaryLinkText}
                    onChange={(e) => setSecondaryLinkText(e.target.value)}
                    className="text-xs bg-background"
                  />
                  <Input
                    type="url"
                    placeholder="https://chat.whatsapp.com/..."
                    value={secondaryLinkUrl}
                    onChange={(e) => setSecondaryLinkUrl(e.target.value)}
                    className="text-xs bg-background"
                  />
                </div>
              )}
            </div>

            {/* Status Feedback Notification */}
            {statusMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 animate-in fade-in ${
                  statusMsg.type === "success"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                {statusMsg.type === "success" ? (
                  <CheckIcon className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircleIcon className="h-4 w-4 shrink-0" />
                )}
                <p className="flex-1">{statusMsg.text}</p>
              </div>
            )}

            {/* Dispatch Action Button */}
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-foreground">
                  Recipient Audience: <span className="text-primary font-extrabold">{subscriberCount}</span> subscriber(s)
                </p>
                <p className="text-[11px] text-muted-foreground">Emails dispatch in background via Resend with deliverability tracking.</p>
              </div>

              <Button
                type="submit"
                disabled={isSending || subscriberCount === 0 || !subject || !bodyContent}
                className="w-full sm:w-auto font-bold text-xs gap-2 shadow-md h-10 px-6"
              >
                {isSending ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    Dispatching Broadcast...
                  </>
                ) : (
                  <>
                    <SendIcon className="h-4 w-4" />
                    Send Broadcast Now
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: LIVE VISUAL MOCKUP PREVIEW (6 Cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 sticky top-6 space-y-4">
          {/* Viewport & Device Controls */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border shadow-xs">
            <div className="flex items-center gap-2">
              <EyeIcon className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground">Live WYSIWYG Mockup</span>
            </div>

            <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewViewport("desktop")}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  previewViewport === "desktop"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MonitorIcon className="h-3.5 w-3.5" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport("mobile")}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  previewViewport === "mobile"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <SmartphoneIcon className="h-3.5 w-3.5" />
                Mobile
              </button>
            </div>
          </div>

          {/* Email Preview Frame */}
          <div className="flex justify-center bg-slate-900/5 dark:bg-slate-950/40 p-4 sm:p-6 rounded-3xl border border-border overflow-hidden">
            <div
              className={`transition-all duration-300 ${
                previewViewport === "mobile"
                  ? "w-[360px] shadow-2xl rounded-[36px] border-[8px] border-slate-800 bg-slate-100 overflow-hidden"
                  : "w-full max-w-[540px] shadow-xl rounded-2xl overflow-hidden bg-slate-100"
              }`}
            >
              {/* Email Client Top Bar */}
              <div className="bg-slate-200/80 px-4 py-2.5 border-b border-slate-300/80 text-[11px] text-slate-700 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">From: {churchName} &lt;noreply@bentplanet.com&gt;</span>
                  <span className="text-[10px] text-slate-500 font-mono">Today, 10:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="truncate">To: Sarah Jenkins (Subscriber)</span>
                  <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-white text-slate-600 border-slate-300">
                    Live Preview
                  </Badge>
                </div>
                {preheader && (
                  <p className="text-[10px] text-slate-500 italic truncate mt-0.5">
                    Preheader: {preheader}
                  </p>
                )}
              </div>

              {/* Email Body Card */}
              <div className="bg-white text-slate-900 font-sans">
                {/* Header Gradient Banner */}
                <div
                  className="p-6 text-center text-white space-y-2 relative overflow-hidden"
                  style={{ background: activeTheme.headerBg }}
                >
                  {badgeLabel && (
                    <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-xs border border-white/20 text-white">
                      {badgeLabel}
                    </span>
                  )}
                  <h2 className="text-lg font-black tracking-tight text-white drop-shadow-xs">
                    {churchName}
                  </h2>
                </div>

                {/* Main Content Area */}
                <div className="p-6 space-y-4">
                  {/* Subject Headline */}
                  <h1 className="text-xl font-extrabold text-slate-900 leading-snug">
                    {subject || "Email Subject Headline"}
                  </h1>

                  {/* Greeting */}
                  <p className="text-xs font-bold text-slate-700">
                    {getGreetingText()}
                  </p>

                  {/* Scripture Callout if enabled */}
                  {enableScripture && scriptureVerse && (
                    <div
                      className="p-3.5 rounded-xl space-y-1"
                      style={{
                        backgroundColor: activeTheme.highlightBoxBg,
                        borderLeft: `4px solid ${activeTheme.primaryColor}`,
                      }}
                    >
                      <p
                        className="text-xs italic leading-relaxed"
                        style={{ color: activeTheme.highlightBoxText }}
                      >
                        &ldquo;{scriptureVerse}&rdquo;
                      </p>
                      {scriptureReference && (
                        <p
                          className="text-[10px] font-bold text-right"
                          style={{ color: activeTheme.primaryColor }}
                        >
                          — {scriptureReference}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Message Paragraphs */}
                  <div className="text-xs text-slate-600 leading-relaxed space-y-2.5 whitespace-pre-wrap">
                    {bodyContent || "Your body content message will appear here in real-time as you write..."}
                  </div>

                  {/* Primary CTA Button */}
                  {ctaUrl && (
                    <div className="pt-2 pb-1 text-center">
                      <a
                        href="#preview-only"
                        onClick={(e) => e.preventDefault()}
                        className="inline-block px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
                        style={{
                          backgroundColor: activeTheme.buttonBg,
                          color: activeTheme.buttonText,
                        }}
                      >
                        {ctaText || "Learn More & Register"}
                      </a>
                    </div>
                  )}

                  {/* Secondary Link */}
                  {enableSecondaryLink && secondaryLinkText && (
                    <div className="text-center pt-1">
                      <a
                        href="#preview-only"
                        onClick={(e) => e.preventDefault()}
                        className="text-xs font-semibold hover:underline"
                        style={{ color: activeTheme.primaryColor }}
                      >
                        {secondaryLinkText}
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer Bar */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 space-y-1">
                  <p>
                    Sent by <strong>{churchName}</strong> via Bent Planet — The Online Conference Platform for Churches.
                  </p>
                  <p>
                    <span className="text-indigo-600 font-semibold underline">Unsubscribe</span> •{" "}
                    <span className="text-indigo-600 font-semibold underline">Request Access on Bent Planet</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Visual Template Gallery Modal */}
      <EmailTemplatesGalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        churchName={churchName}
        onSelectTemplate={(tmpl) => applyTemplate(tmpl)}
      />
    </div>
  );
}
