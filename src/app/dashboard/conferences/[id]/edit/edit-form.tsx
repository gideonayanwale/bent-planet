"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SaveIcon,
  Trash2Icon,
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
  { id: "modern_gradient", name: "Modern Vibrant Gradient" },
  { id: "dark_revival", name: "Dark Atmosphere & Fire" },
  { id: "cathedral_minimal", name: "Minimalist Cathedral" },
  { id: "youth_energy", name: "High Energy Youth" },
];

export function EditConferenceForm({
  conference,
  churchSlug,
  churchName,
}: EditConferenceFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: conference.title || "",
    slug: conference.slug || "",
    eventType: conference.event_type || "Conference",
    theme: conference.theme || "Revival & Healing",
    speaker: conference.speaker_name || "",
    hostName: conference.host_name || "",
    date: conference.conference_date || "",
    endDate: conference.end_date || "",
    startTime: conference.conference_time || "18:00",
    caption: conference.caption || "",
    streamUrl: conference.stream_url || "",
    whatsappGroupUrl: conference.whatsapp_group_url || "",
    whatsappContactNumber: conference.whatsapp_contact_number || "",
    templateId: conference.template_id || "modern_gradient",
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload = new FormData(e.currentTarget);
      payload.set("agenda", JSON.stringify(agenda));
      payload.set("enable_replay", String(formData.enableReplay));
      payload.set("status", formData.status);
      payload.set("event_type", formData.eventType);
      payload.set("host_name", formData.hostName);
      payload.set("end_date", formData.endDate);
      payload.set("whatsapp_contact_number", formData.whatsappContactNumber);
      payload.set("template_id", formData.templateId);

      const res = await updateConferenceAction(conference.id, payload);

      if (res?.error) {
        setStatusMessage({ type: "error", text: res.error });
      } else {
        setStatusMessage({ type: "success", text: "Conference updated successfully!" });
        router.refresh();
      }
    } catch (err: unknown) {
      const error = err as Error;
      setStatusMessage({ type: "error", text: error.message || "Failed to update conference." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteConferenceAction(conference.id);
      if (res?.error) {
        alert(res.error);
        setIsDeleting(false);
      } else {
        router.push("/dashboard/conferences");
        router.refresh();
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Failed to delete conference.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/conferences">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-heading text-slate-900">Edit Event</h1>
            <p className="text-xs text-slate-500 font-mono">ID: {conference.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="text-xs">
            <a href={`/c/${churchSlug}/${formData.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="h-3.5 w-3.5 mr-1" />
              View Live Page
            </a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2Icon className="h-3.5 w-3.5 mr-1" />
            Delete Event
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Event Identity */}
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Event Details & Category</CardTitle>
            <CardDescription className="text-xs">
              Basic conference identifiers and URL slug.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-bold">Event Title *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slug" className="text-xs font-bold">URL Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="eventType" className="text-xs font-bold">Event Type</Label>
                <select
                  id="eventType"
                  name="event_type"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
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
                  name="theme"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  {THEME_OPTIONS.map((th) => (
                    <option key={th} value={th}>{th}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-bold">Publishing Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" | "archived" })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="published">Published (Live to public)</option>
                  <option value="draft">Draft (Private in dashboard)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="speaker_name" className="text-xs font-bold">Guest Speaker(s)</Label>
                <Input
                  id="speaker_name"
                  name="speaker_name"
                  value={formData.speaker}
                  onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="host_name" className="text-xs font-bold">Event Host</Label>
                <Input
                  id="host_name"
                  name="host_name"
                  value={formData.hostName}
                  onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="caption" className="text-xs font-bold">Short Caption</Label>
              <Textarea
                id="caption"
                name="caption"
                rows={2}
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Dates, Stream & Flyer */}
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Schedule, Media & Layout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="conference_date" className="text-xs font-bold">Start Date</Label>
                <Input
                  id="conference_date"
                  name="conference_date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end_date" className="text-xs font-bold">End Date (Multi-Day)</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="conference_time" className="text-xs font-bold">Daily Time</Label>
                <Input
                  id="conference_time"
                  name="conference_time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="stream_url" className="text-xs font-bold">Livestream Broadcast URL</Label>
                <Input
                  id="stream_url"
                  name="stream_url"
                  type="url"
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="template_id" className="text-xs font-bold">Template Layout</Label>
                <select
                  id="template_id"
                  name="template_id"
                  value={formData.templateId}
                  onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  {TEMPLATE_OPTIONS.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Banner Flyer Upload */}
            <div className="space-y-2 p-4 rounded-2xl border border-slate-200 bg-slate-50/60">
              <Label className="text-xs font-bold">Event Flyer Banner</Label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full sm:w-48 h-28 object-cover rounded-xl border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-full sm:w-48 h-28 rounded-xl bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-500">
                    No flyer banner
                  </div>
                )}
                <div className="space-y-1.5 flex-1">
                  <Input
                    id="banner"
                    name="banner"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="text-xs bg-white"
                  />
                  <p className="text-[11px] text-slate-500">Select a file to replace the current banner.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: WhatsApp & Free Study Material */}
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader>
            <CardTitle className="text-lg">WhatsApp Community & Study Materials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp_group_url" className="text-xs font-bold">WhatsApp Community / Group Invite</Label>
                <Input
                  id="whatsapp_group_url"
                  name="whatsapp_group_url"
                  type="url"
                  value={formData.whatsappGroupUrl}
                  onChange={(e) => setFormData({ ...formData, whatsappGroupUrl: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsapp_contact_number" className="text-xs font-bold">Coordinator WhatsApp Contact Number (for Click-to-Chat)</Label>
                <Input
                  id="whatsapp_contact_number"
                  name="whatsapp_contact_number"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.whatsappContactNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappContactNumber: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="free_resource_name" className="text-xs font-bold">Free Study Guide / Resource Title</Label>
                <Input
                  id="free_resource_name"
                  name="free_resource_name"
                  value={formData.freeResourceName}
                  onChange={(e) => setFormData({ ...formData, freeResourceName: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="free_resource_url" className="text-xs font-bold">Free Resource PDF / Ebook URL</Label>
                <Input
                  id="free_resource_url"
                  name="free_resource_url"
                  type="url"
                  value={formData.freeResourceUrl}
                  onChange={(e) => setFormData({ ...formData, freeResourceUrl: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Full Spirit-Filled Description & Agenda */}
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Full Description, Speaker Bio & Agenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="full_description" className="text-xs font-bold">Full Spirit-Filled Description</Label>
              <Textarea
                id="full_description"
                name="full_description"
                rows={8}
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                className="text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="speaker_bio" className="text-xs font-bold">Speaker Biography</Label>
              <Textarea
                id="speaker_bio"
                name="speaker_bio"
                rows={3}
                value={formData.speakerBio}
                onChange={(e) => setFormData({ ...formData, speakerBio: e.target.value })}
                className="text-xs"
              />
            </div>

            {/* Interactive Agenda Builder */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-800">Conference Agenda Sessions</Label>
                <Button type="button" variant="outline" size="xs" onClick={handleAddAgendaItem} className="text-xs">
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Add Session
                </Button>
              </div>

              <div className="space-y-3">
                {agenda.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <Input
                      placeholder="Time (e.g. 10:00 AM)"
                      value={item.time}
                      onChange={(e) => handleUpdateAgendaItem(idx, "time", e.target.value)}
                      className="text-xs sm:w-36 bg-white"
                    />
                    <Input
                      placeholder="Session Title"
                      value={item.title}
                      onChange={(e) => handleUpdateAgendaItem(idx, "title", e.target.value)}
                      className="text-xs sm:w-48 bg-white font-semibold"
                    />
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleUpdateAgendaItem(idx, "description", e.target.value)}
                      className="text-xs flex-1 bg-white"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => handleRemoveAgendaItem(idx)}
                      className="text-xs text-red-500 hover:bg-red-50 shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 shadow-md"
            disabled={isSaving}
          >
            <SaveIcon className="h-4 w-4" />
            {isSaving ? "Saving Changes..." : "Save Conference Changes"}
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-heading font-bold text-lg text-slate-900">Delete Conference</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>{conference.title}</strong>? All registered attendees and stats for this event will be safely cleaned up.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs font-bold"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Permanently"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
