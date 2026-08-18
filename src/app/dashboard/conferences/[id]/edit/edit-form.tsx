"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SaveIcon,
  Trash2Icon,
  Share2Icon,
  ExternalLinkIcon,
  PlusIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  SparklesIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/types/database";
import { updateConferenceAction, deleteConferenceAction } from "../actions";

type ConferenceRow = Database["public"]["Tables"]["conferences"]["Row"];

interface AgendaItem {
  time: string;
  title: string;
  description: string;
}

interface EditConferenceFormProps {
  conference: ConferenceRow;
  churchSlug: string;
  churchName: string;
}

export function EditConferenceForm({
  conference,
  churchSlug,
  churchName,
}: EditConferenceFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: conference.title || "",
    theme: conference.theme || "Revival & Healing",
    speaker: conference.speaker_name || "",
    date: conference.conference_date || "",
    startTime: conference.conference_time || "18:00",
    caption: conference.caption || "",
    streamUrl: conference.stream_url || "",
    whatsappGroupUrl: conference.whatsapp_group_url || "",
    whatsappChannelUrl: conference.whatsapp_channel_url || "",
    shortUrl: conference.short_url || "",
    enableReplay: conference.enable_replay ?? true,
    fullDescription: conference.full_description || "",
    speakerBio: conference.speaker_bio || "",
    status: conference.status || "published",
    freeResourceUrl: conference.free_resource_url || "",
    freeResourceName: conference.free_resource_name || "",
  });

  const [agenda, setAgenda] = useState<AgendaItem[]>(() => {
    if (Array.isArray(conference.agenda)) {
      return conference.agenda as unknown as AgendaItem[];
    }
    return [
      { time: "09:00 AM", title: "Opening Worship", description: "Laying the spiritual foundation" },
      { time: "10:30 AM", title: "Keynote Ministration", description: "Inspiring teaching and message" },
      { time: "01:00 PM", title: "Closing Prayer", description: "Altar call and benediction" },
    ];
  });

  const [bannerPreview, setBannerPreview] = useState<string | null>(conference.banner_url || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isRegeneratingAI, setIsRegeneratingAI] = useState(false);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleAddAgendaItem = () => {
    setAgenda([...agenda, { time: "02:00 PM", title: "New Session", description: "Session details" }]);
  };

  const handleUpdateAgendaItem = (index: number, field: keyof AgendaItem, value: string) => {
    const updated = [...agenda];
    updated[index] = { ...updated[index], [field]: value };
    setAgenda(updated);
  };

  const handleRemoveAgendaItem = (index: number) => {
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  const handleRegenerateCopy = async () => {
    setIsRegeneratingAI(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/generate-conference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          theme: formData.theme,
          speaker: formData.speaker,
          date: formData.date,
          startTime: formData.startTime,
          caption: formData.caption,
          churchName,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (data.fullDescription) {
        setFormData((prev) => ({
          ...prev,
          fullDescription: data.fullDescription,
          speakerBio: data.speakerBio || prev.speakerBio,
        }));
      }
      if (data.agenda && Array.isArray(data.agenda) && data.agenda.length > 0) {
        setAgenda(data.agenda);
      }
      setStatusMessage({ type: "success", text: "AI content refreshed successfully! Review and click Save Changes." });
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMessage({ type: "error", text: error.message || "Failed to regenerate content." });
    } finally {
      setIsRegeneratingAI(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, String(value));
      });

      formDataObj.append("agenda", JSON.stringify(agenda));

      const fileInput = document.querySelector<HTMLInputElement>("#bannerImageInput");
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formDataObj.append("banner", fileInput.files[0]);
      }

      const result = await updateConferenceAction(conference.id, formDataObj);
      if (result.error) {
        setStatusMessage({ type: "error", text: result.error });
      } else {
        setStatusMessage({ type: "success", text: "Conference updated successfully!" });
        router.refresh();
      }
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMessage({ type: "error", text: error.message || "Failed to save conference." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteConferenceAction(conference.id);
      if (result.error) {
        alert(result.error);
        setIsDeleting(false);
        setShowDeleteModal(false);
      } else {
        router.push("/dashboard/conferences");
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to delete conference.");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const publicUrl = `/c/${churchSlug}/${conference.slug}`;

  return (
    <div className="space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/conferences"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Back to Conferences
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900">
              Edit Conference
            </h1>
            <Badge
              variant="outline"
              className={
                formData.status === "published"
                  ? "bg-green-50 text-green-700 border-green-200 capitalize font-medium"
                  : formData.status === "draft"
                  ? "bg-amber-50 text-amber-700 border-amber-200 capitalize font-medium"
                  : "bg-slate-100 text-slate-700 border-slate-200 capitalize font-medium"
              }
            >
              {formData.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Update event details, schedule, livestream links, and banner graphics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {formData.status === "published" && (
            <>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href={`/dashboard/conferences/${conference.id}/promote`}>
                  <Share2Icon className="h-4 w-4 text-indigo-600" />
                  Promote & Captions
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLinkIcon className="h-4 w-4 text-slate-600" />
                  View Live Page
                </a>
              </Button>
            </>
          )}

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="gap-1.5"
          >
            <Trash2Icon className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl text-sm ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2Icon className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircleIcon className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Conference Information Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Details (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200/80 bg-white shadow-xs">
              <CardHeader>
                <CardTitle className="text-lg">Event Information</CardTitle>
                <CardDescription className="text-xs">
                  Basic conference information and minister details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Conference Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <option value="Faith & Breakthrough">Faith & Breakthrough</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="speaker">Ministers / Speakers *</Label>
                    <Input
                      id="speaker"
                      required
                      value={formData.speaker}
                      onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    />
                  </div>
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

                <div className="space-y-2">
                  <Label htmlFor="streamUrl">Livestream URL (YouTube / Vimeo / Zoom)</Label>
                  <Input
                    id="streamUrl"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.streamUrl}
                    onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsappGroupUrl">WhatsApp Group Invite Link</Label>
                    <Input
                      id="whatsappGroupUrl"
                      type="url"
                      placeholder="https://chat.whatsapp.com/..."
                      value={formData.whatsappGroupUrl}
                      onChange={(e) => setFormData({ ...formData, whatsappGroupUrl: e.target.value })}
                    />
                    <p className="text-[11px] text-slate-400">Invite attendees to join your conference WhatsApp group.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsappChannelUrl">WhatsApp Channel Link</Label>
                    <Input
                      id="whatsappChannelUrl"
                      type="url"
                      placeholder="https://whatsapp.com/channel/..."
                      value={formData.whatsappChannelUrl}
                      onChange={(e) => setFormData({ ...formData, whatsappChannelUrl: e.target.value })}
                    />
                    <p className="text-[11px] text-slate-400">Official church channel link for updates.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortUrl">Custom Shortened URL (Bitly / Custom Slug)</Label>
                  <Input
                    id="shortUrl"
                    type="url"
                    placeholder="https://bit.ly/..."
                    value={formData.shortUrl}
                    onChange={(e) => setFormData({ ...formData, shortUrl: e.target.value })}
                  />
                  <p className="text-[11px] text-slate-400">Bitly link or custom URL for sharing on social media.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">Short Context / Notes</Label>
                  <Textarea
                    id="caption"
                    rows={2}
                    placeholder="Focus scriptures or special theme instructions..."
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description and Speaker Bio */}
            <Card className="border-slate-200/80 bg-white shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-lg">Full Description & Speaker Bio</CardTitle>
                  <CardDescription className="text-xs">
                    Displayed prominently on your public conference landing page.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateCopy}
                  disabled={isRegeneratingAI}
                  className="gap-1.5 text-xs text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                >
                  <SparklesIcon className="h-3.5 w-3.5" />
                  {isRegeneratingAI ? "AI Generating..." : "AI Re-write Copy"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullDescription">Full Description</Label>
                  <Textarea
                    id="fullDescription"
                    rows={8}
                    className="text-sm leading-relaxed"
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="speakerBio">Speaker Biography</Label>
                  <Textarea
                    id="speakerBio"
                    rows={4}
                    className="text-sm leading-relaxed"
                    value={formData.speakerBio}
                    onChange={(e) => setFormData({ ...formData, speakerBio: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Agenda Builder */}
            <Card className="border-slate-200/80 bg-white shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-lg">Conference Agenda / Schedule</CardTitle>
                  <CardDescription className="text-xs">
                    Time-blocked agenda items shown to attendees.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddAgendaItem}
                  className="gap-1 text-xs"
                >
                  <PlusIcon className="h-3.5 w-3.5" /> Add Session
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {agenda.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Input
                        value={item.time}
                        placeholder="Time (e.g. 10:00 AM)"
                        className="w-36 text-xs font-mono font-medium bg-white"
                        onChange={(e) => handleUpdateAgendaItem(index, "time", e.target.value)}
                      />
                      <Input
                        value={item.title}
                        placeholder="Session Title"
                        className="flex-1 text-sm font-semibold bg-white"
                        onChange={(e) => handleUpdateAgendaItem(index, "title", e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAgendaItem(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 text-xs"
                      >
                        Remove
                      </Button>
                    </div>
                    <Input
                      value={item.description}
                      placeholder="Brief session description..."
                      className="text-xs bg-white text-slate-600"
                      onChange={(e) => handleUpdateAgendaItem(index, "description", e.target.value)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Controls (1 col) */}
          <div className="space-y-6">
            {/* Status and Visibility */}
            <Card className="border-slate-200/80 bg-white shadow-xs">
              <CardHeader>
                <CardTitle className="text-base">Publication & Status</CardTitle>
                <CardDescription className="text-xs">Control public visibility.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-xs">Status</Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-medium"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="published">Published (Live to public)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="enableReplay"
                    checked={formData.enableReplay}
                    onChange={(e) => setFormData({ ...formData, enableReplay: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label htmlFor="enableReplay" className="text-xs text-slate-700 cursor-pointer">
                    Enable Replay player after live stream
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-md mt-4"
                  disabled={isSaving}
                >
                  <SaveIcon className="h-4 w-4" />
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Banner Image */}
            <Card className="border-slate-200/80 bg-white shadow-xs">
              <CardHeader>
                <CardTitle className="text-base">Conference Banner</CardTitle>
                <CardDescription className="text-xs">Header image displayed on landing page and OG cards.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bannerPreview ? (
                  <div className="space-y-2">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-36 object-cover rounded-xl border border-slate-200"
                    />
                    <p className="text-[11px] text-slate-500">Current banner graphic</p>
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                    No banner uploaded
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bannerImageInput" className="text-xs font-semibold">
                    Replace Banner Graphic
                  </Label>
                  <Input
                    id="bannerImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Free Resource / PDF Section */}
            <Card className="border-slate-200/80 bg-white shadow-xs">
              <CardHeader>
                <CardTitle className="text-base">Free Attendee Resource</CardTitle>
                <CardDescription className="text-xs">Optional downloadable PDF guide or notes for subscribers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="freeResourceName" className="text-xs">Resource Name</Label>
                  <Input
                    id="freeResourceName"
                    placeholder="e.g. Revival Study Guide & Notes (PDF)"
                    value={formData.freeResourceName}
                    onChange={(e) => setFormData({ ...formData, freeResourceName: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="freeResourceUrl" className="text-xs">Download URL</Label>
                  <Input
                    id="freeResourceUrl"
                    type="url"
                    placeholder="https://..."
                    value={formData.freeResourceUrl}
                    onChange={(e) => setFormData({ ...formData, freeResourceUrl: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 rounded-xl bg-red-50">
                <Trash2Icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">Delete Conference?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900 font-semibold">{conference.title}</strong>?
              This action will remove the conference page, registration links, and related UTM logs. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-1.5"
              >
                <Trash2Icon className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Yes, Delete Conference"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
