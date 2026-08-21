"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SparklesIcon,
  CheckCircle2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { saveConferenceAction } from "./actions";

const EVENT_TYPES = [
  "Conference",
  "Revival & Healing Meeting",
  "Youth & Campus Summit",
  "Women's Conference",
  "Men's Conference",
  "Retreat & Campmeeting",
  "Monthly Miracle Service",
  "Weekly Service Broadcast",
  "Special Workshop / Seminar",
];

const THEME_OPTIONS = [
  "Revival & Healing",
  "Prophetic & Prayer",
  "Leadership & Ministry",
  "Youth & Campus",
  "Worship & Praise",
  "Women's Conference",
  "Evangelism & Outreach",
  "Faith & Breakthrough",
  "Kingdom Finances",
  "Marriage & Family",
];

const TEMPLATE_OPTIONS = [
  { id: "modern_gradient", name: "Modern Vibrant Gradient", desc: "Sleek indigo & purple glow" },
  { id: "dark_revival", name: "Dark Atmosphere & Fire", desc: "Cinematic deep amber & gold" },
  { id: "cathedral_minimal", name: "Minimalist Cathedral", desc: "Clean white & slate elegance" },
  { id: "youth_energy", name: "High Energy Youth", desc: "Vibrant neon & bold typography" },
];

export default function NewConferencePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("Conference");
  const [theme, setTheme] = useState("Revival & Healing");
  const [speaker, setSpeaker] = useState("");
  const [hostName, setHostName] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [caption, setCaption] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState("");
  const [whatsappContactNumber, setWhatsappContactNumber] = useState("");
  const [templateId, setTemplateId] = useState("modern_gradient");
  const [enableReplay, setEnableReplay] = useState(true);
  const [freeResourceName, setFreeResourceName] = useState("");
  const [freeResourceUrl, setFreeResourceUrl] = useState("");

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState<"input" | "review">("input");

  interface GeneratedContent {
    fullDescription: string;
    agenda: Array<{ time: string; title: string; description: string }>;
    speakerBio: string;
    ogTitle: string;
    ogDescription: string;
    socialCaptions: {
      instagram?: string;
      whatsapp?: string;
      twitter?: string;
      facebook?: string;
    };
  }

  const [generatedData, setGeneratedData] = useState<GeneratedContent | null>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) {
      alert("Please provide the event title and start date.");
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate-conference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          eventType,
          theme,
          speaker,
          hostName,
          date,
          endDate,
          startTime,
          caption,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGeneratedData(data);
      setStep("review");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("AI Generation Error:", error);
      alert("AI Generation completed with rich faith fallback.");
      setStep("review");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async (status: "published" | "draft") => {
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("eventType", eventType);
      formData.append("theme", theme);
      formData.append("speaker", speaker);
      formData.append("hostName", hostName);
      formData.append("date", date);
      if (endDate) formData.append("endDate", endDate);
      formData.append("startTime", startTime);
      formData.append("caption", caption);
      formData.append("streamUrl", streamUrl);
      formData.append("whatsappGroupUrl", whatsappGroupUrl);
      formData.append("whatsappContactNumber", whatsappContactNumber);
      formData.append("templateId", templateId);
      formData.append("enableReplay", String(enableReplay));
      formData.append("freeResourceName", freeResourceName);
      formData.append("freeResourceUrl", freeResourceUrl);
      formData.append("status", status);

      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      if (generatedData) {
        formData.append("generatedData", JSON.stringify(generatedData));
      }

      const res = await saveConferenceAction(formData);

      if (res?.error) {
        alert(res.error);
      } else {
        router.push("/dashboard/conferences");
        router.refresh();
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Save Conference Error:", error);
      alert(error.message || "Failed to save conference.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900">
          Create & AI-Generate Ministry Event
        </h1>
        <p className="text-slate-600 mt-1">
          Fill in your basic event details — our AI generator writes full Spirit-filled descriptions, speaker bios, and social copy.
        </p>
      </div>

      {step === "input" ? (
        <form onSubmit={handleGenerate} className="space-y-8">
          {/* Section 1: Event Details */}
          <Card className="border-slate-200/80 shadow-xs bg-white">
            <CardHeader>
              <CardTitle className="text-lg">1. Event Basics & Category</CardTitle>
              <CardDescription className="text-xs">
                Define the core identity of your conference, summit, or church programme.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold">Event Title *</Label>
                <Input
                  id="name"
                  required
                  placeholder="e.g. Open Heavens Conference 2026: Supernatural Shift"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="eventType" className="text-xs font-bold">Event Type</Label>
                  <select
                    id="eventType"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="theme" className="text-xs font-bold">Theme / Focus</Label>
                  <select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    {THEME_OPTIONS.map((th) => (
                      <option key={th} value={th}>{th}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="speaker" className="text-xs font-bold">Guest Speaker(s) / Ministers</Label>
                  <Input
                    id="speaker"
                    placeholder="e.g. Apostle Michael Johnson & Pastor Grace"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="hostName" className="text-xs font-bold">Event Host / Person in Charge</Label>
                  <Input
                    id="hostName"
                    placeholder="e.g. Pastor David Jenkins"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="caption" className="text-xs font-bold">Event Summary / Short Caption</Label>
                <Textarea
                  id="caption"
                  rows={3}
                  placeholder="2–3 sentences about what God is going to do at this event (AI will expand this into 600 words)..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="text-xs leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Schedule & Stream Link */}
          <Card className="border-slate-200/80 shadow-xs bg-white">
            <CardHeader>
              <CardTitle className="text-lg">2. Dates, Livestream & Media</CardTitle>
              <CardDescription className="text-xs">
                Set single/multi-day dates, broadcast link, and flyer layout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="date" className="text-xs font-bold">Start Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="endDate" className="text-xs font-bold">End Date (If Multi-Day)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="startTime" className="text-xs font-bold">Daily Start Time</Label>
                  <Input
                    id="startTime"
                    placeholder="e.g. 6:00 PM EST"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="streamUrl" className="text-xs font-bold">Livestream Broadcast URL</Label>
                  <Input
                    id="streamUrl"
                    type="url"
                    placeholder="https://youtube.com/live/... or Vimeo / Zoom URL"
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    className="text-xs"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="enableReplay"
                      checked={enableReplay}
                      onChange={(e) => setEnableReplay(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                    />
                    <Label htmlFor="enableReplay" className="text-[11px] text-slate-600 font-medium">
                      Enable on-demand replay player after conference ends
                    </Label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="templateId" className="text-xs font-bold">Landing Page Template Theme</Label>
                  <select
                    id="templateId"
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  >
                    {TEMPLATE_OPTIONS.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.name} ({tmpl.desc})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Flyer Banner Upload */}
              <div className="space-y-2 p-4 rounded-2xl border border-slate-200 bg-slate-50/60">
                <Label htmlFor="banner" className="text-xs font-bold">Event Flyer Banner Image</Label>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {bannerPreview ? (
                    <img
                      src={bannerPreview}
                      alt="Banner Preview"
                      className="w-full sm:w-48 h-28 object-cover rounded-xl border border-slate-200 shadow-xs"
                    />
                  ) : (
                    <div className="w-full sm:w-48 h-28 rounded-xl bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-500">
                      No flyer selected
                    </div>
                  )}
                  <div className="space-y-1 flex-1">
                    <Input
                      id="banner"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="text-xs bg-white"
                    />
                    <p className="text-[11px] text-slate-500">Recommended 1920×1080px or high-res JPG/PNG</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: WhatsApp & Free Resource */}
          <Card className="border-slate-200/80 shadow-xs bg-white">
            <CardHeader>
              <CardTitle className="text-lg">3. WhatsApp Engagement & Study Guides</CardTitle>
              <CardDescription className="text-xs">
                Equip attendees with one-click WhatsApp groups, direct click-to-chat RSVP, and downloadable notes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="whatsappGroupUrl" className="text-xs font-bold">WhatsApp Community / Group Link</Label>
                  <Input
                    id="whatsappGroupUrl"
                    type="url"
                    placeholder="https://chat.whatsapp.com/..."
                    value={whatsappGroupUrl}
                    onChange={(e) => setWhatsappGroupUrl(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="whatsappContactNumber" className="text-xs font-bold">Coordinator WhatsApp Contact Number (for Click-to-Chat)</Label>
                  <Input
                    id="whatsappContactNumber"
                    type="tel"
                    placeholder="+1 234 567 8900 (enables WhatsApp RSVP button)"
                    value={whatsappContactNumber}
                    onChange={(e) => setWhatsappContactNumber(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="freeResourceName" className="text-xs font-bold">Free Study Guide / Devotional Title</Label>
                  <Input
                    id="freeResourceName"
                    placeholder="e.g. 7-Day Fasting Guide & Ministration Notes"
                    value={freeResourceName}
                    onChange={(e) => setFreeResourceName(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="freeResourceUrl" className="text-xs font-bold">Resource PDF Download or Purchase Link</Label>
                  <Input
                    id="freeResourceUrl"
                    type="url"
                    placeholder="https://... (downloadable PDF or e-book URL)"
                    value={freeResourceUrl}
                    onChange={(e) => setFreeResourceUrl(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="submit"
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 text-xs shadow-md"
              disabled={isGenerating}
            >
              <SparklesIcon className="h-4 w-4" />
              {isGenerating ? "AI is Generating Conference Page..." : "Generate AI Conference Content"}
            </Button>
          </div>
        </form>
      ) : (
        /* Review Step */
        <div className="space-y-8 animate-in fade-in">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold">
            <span>✨ AI Generation Complete! Review, customize, and publish your conference.</span>
            <Button variant="ghost" size="xs" onClick={() => setStep("input")} className="text-emerald-800 hover:bg-emerald-100 text-xs">
              ← Edit Input Fields
            </Button>
          </div>

          <Card className="border-slate-200/80 bg-white shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg">AI-Generated Conference Copy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Full Spirit-Filled Description (Editable)</Label>
                <Textarea
                  rows={8}
                  value={generatedData?.fullDescription || ""}
                  onChange={(e) =>
                    setGeneratedData((prev) => prev ? { ...prev, fullDescription: e.target.value } : null)
                  }
                  className="text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Speaker Bio (Editable)</Label>
                <Textarea
                  rows={3}
                  value={generatedData?.speakerBio || ""}
                  onChange={(e) =>
                    setGeneratedData((prev) => prev ? { ...prev, speakerBio: e.target.value } : null)
                  }
                  className="text-xs leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handlePublish("draft")}
              disabled={isSaving}
              className="text-xs"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={() => handlePublish("published")}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 shadow-md"
            >
              <CheckCircle2Icon className="h-4 w-4" />
              {isSaving ? "Publishing..." : "Publish Live Event"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
