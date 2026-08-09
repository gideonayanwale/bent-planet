"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SparklesIcon,
  CheckCircle2Icon,
  ArrowLeftIcon,
  EyeIcon,
  Edit2Icon,
  GlobeIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { saveConferenceAction } from "./actions";

interface GeneratedConferenceData {
  fullDescription: string;
  speakerBio: string;
  agenda: { time: string; title: string; description: string }[];
  ogTitle?: string;
  ogDescription?: string;
  inviteEmailCopy?: string;
}

export default function NewConferencePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedConferenceData | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    theme: "Revival & Healing",
    speaker: "",
    date: "",
    startTime: "18:00",
    caption: "",
    streamUrl: "",
    enableReplay: true,
    hasFreeResource: false,
  });

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-conference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setGeneratedData(data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedData) return;
    setIsSaving(true);
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => formDataObj.append(key, String(value)));
      formDataObj.append("generatedData", JSON.stringify(generatedData));

      const fileInput = document.querySelector<HTMLInputElement>("#bannerImage");
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formDataObj.append("banner", fileInput.files[0]);
      }

      const result = await saveConferenceAction(formDataObj);
      if (result.error) throw new Error(result.error);

      router.push("/dashboard/conferences");
    } catch (error) {
      console.error(error);
      alert("Failed to save conference.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Back to Conferences
          </button>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900">
            Create AI-Powered Conference Page
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Provide basic event details and Bent Planet AI will write a Spirit-filled description, time-blocked agenda, and OG tags.
          </p>
        </div>
      </div>

      {!generatedData ? (
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Conference Basics</CardTitle>
                <CardDescription className="text-xs">Fill in your event details for AI generation.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Conference Name *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="e.g. Open Heavens & Prophetic Gathering 2025"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Conference Theme / Category *</Label>
                  <select
                    id="theme"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  >
                    <option value="Revival & Healing">Revival & Healing</option>
                    <option value="Prophetic & Prayer">Prophetic & Prayer</option>
                    <option value="Leadership & Ministry">Leadership & Ministry</option>
                    <option value="Youth & Campus">Youth & Campus</option>
                    <option value="Worship & Praise">Worship & Praise</option>
                    <option value="Womens Conference">Womens Conference</option>
                    <option value="Evangelism & Outreach">Evangelism & Outreach</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="speaker">Ministers / Speakers *</Label>
                  <Input
                    id="speaker"
                    required
                    placeholder="e.g. Pastor David John, Min. Sarah Jenkins"
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="streamUrl">Stream Link (YouTube Live / Vimeo / Zoom URL)</Label>
                <Input
                  id="streamUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Short Context for AI (Key focus or scriptures)</Label>
                <Textarea
                  id="caption"
                  required
                  rows={3}
                  placeholder="Share a few sentences on the heart of this conference, key Scriptures, or divine expectations..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:opacity-95 gap-2"
                disabled={isGenerating}
              >
                <SparklesIcon className="h-4 w-4" />
                {isGenerating ? "AI is generating Spirit-filled content..." : "Generate AI Conference Landing Page"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 px-6 text-emerald-900">
            <div className="flex items-center gap-3">
              <CheckCircle2Icon className="h-6 w-6 text-emerald-600" />
              <div>
                <h3 className="font-heading font-bold text-sm">AI Content Generated Successfully!</h3>
                <p className="text-xs text-emerald-700">Review, edit if needed, upload your banner, and publish.</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGeneratedData(null)}
              className="text-xs border-emerald-300 bg-white hover:bg-emerald-100"
            >
              Re-generate
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Generated AI Content Editor */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200/80 bg-white shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    <span>Generated Full Description</span>
                    <Edit2Icon className="h-4 w-4 text-slate-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={8}
                    value={generatedData.fullDescription}
                    onChange={(e) => setGeneratedData({ ...generatedData, fullDescription: e.target.value })}
                    className="text-xs text-slate-700 leading-relaxed font-sans"
                  />
                </CardContent>
              </Card>

              <Card className="border-slate-200/80 bg-white shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Speaker Bio & Time-blocked Agenda</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-xs font-semibold text-slate-700">Speaker Bio</Label>
                    <Textarea
                      rows={3}
                      value={generatedData.speakerBio}
                      onChange={(e) => setGeneratedData({ ...generatedData, speakerBio: e.target.value })}
                      className="text-xs mt-1 text-slate-700"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-slate-700 mb-2 block">Event Schedule / Agenda</Label>
                    <div className="space-y-3">
                      {generatedData.agenda.map((item, i) => (
                        <div key={i} className="flex gap-3 rounded-xl border border-slate-200 p-3 bg-slate-50/60">
                          <span className="text-xs font-mono font-bold text-indigo-600 bg-white px-2 py-1 rounded border border-slate-200 h-fit">
                            {item.time}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{item.title}</p>
                            <p className="text-[11px] text-slate-500">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Banner Upload & Live Page Preview */}
            <div className="space-y-6">
              <Card className="border-slate-200/80 bg-white shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Banner & Publication</CardTitle>
                  <CardDescription className="text-xs">Upload event graphic to publish.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bannerImage" className="text-xs">Conference Banner Image *</Label>
                    {bannerPreview && (
                      <img src={bannerPreview} alt="Banner preview" className="h-32 w-full object-cover rounded-xl border border-slate-200" />
                    )}
                    <Input id="bannerImage" type="file" accept="image/*" onChange={handleBannerChange} required className="text-xs" />
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-md"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <GlobeIcon className="h-4 w-4" />
                    {isSaving ? "Publishing Conference..." : "Publish Conference Page"}
                  </Button>
                </CardContent>
              </Card>

              {/* Live Preview Miniature Card */}
              <Card className="border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white shadow-xs">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <EyeIcon className="h-4 w-4 text-indigo-600" /> Live Public Preview
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
                    <span className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-800">
                      {formData.theme}
                    </span>
                    <h5 className="font-heading font-bold text-sm text-slate-900">{formData.name}</h5>
                    <p className="text-[11px] text-slate-500">🗓️ {formData.date} at {formData.startTime}</p>
                    <p className="text-[11px] text-slate-500">🗣️ {formData.speaker}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
