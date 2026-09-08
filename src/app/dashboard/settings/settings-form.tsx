"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2Icon,
  ImageIcon,
  Share2Icon,
  UserCheckIcon,
  SaveIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  GlobeIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";
import { saveChurchSettings } from "./actions";

type ChurchRow = Database["public"]["Tables"]["churches"]["Row"];

interface SettingsFormProps {
  church: ChurchRow;
}

export function SettingsForm({ church }: SettingsFormProps) {
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(church.logo_url || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(church.banner_url || null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await saveChurchSettings(formData);
      if (res?.error) {
        setFeedback({ type: "error", message: res.error });
        return;
      }
      setFeedback({ type: "success", message: "Church profile and branding updated successfully!" });
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      setFeedback({ type: "error", message: error.message || "Failed to update settings" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {feedback && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2Icon className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircleIcon className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Visual Branding: Logo & Banner */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg text-card-foreground">Visual Branding & Assets</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Upload your official church logo and homepage cover banner.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Logo Upload */}
            <div className="space-y-3 p-4 rounded-2xl border border-border bg-secondary/30">
              <Label className="text-xs font-bold text-foreground block">Church Logo</Label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-800 bg-background shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground font-bold shrink-0">
                    {church.name ? church.name.charAt(0) : "Logo"}
                  </div>
                )}
                <div className="space-y-1.5 flex-1">
                  <Input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="text-xs bg-background"
                  />
                  <p className="text-[11px] text-muted-foreground">Recommended: Square PNG/JPEG, min 400×400px</p>
                </div>
              </div>
            </div>

            {/* Banner Upload */}
            <div className="space-y-3 p-4 rounded-2xl border border-border bg-secondary/30">
              <Label className="text-xs font-bold text-foreground block">Homepage Cover Banner</Label>
              <div className="space-y-2">
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-24 rounded-xl object-cover border border-border shadow-xs"
                  />
                ) : (
                  <div className="w-full h-24 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                    No banner set (default gradient will be used)
                  </div>
                )}
                <Input
                  id="banner"
                  name="banner"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="text-xs bg-background"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Church Profile */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
              <Building2Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg text-card-foreground">Church Information</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Public details displayed on your Bent Planet ministry homepage.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name">Church Name *</Label>
              <Input id="name" name="name" defaultValue={church.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Public URL Slug</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="slug"
                  defaultValue={`bentplanet.com/c/${church.slug}`}
                  disabled
                  className="bg-muted font-mono text-xs text-muted-foreground"
                />
                <Button asChild variant="outline" size="sm" className="shrink-0 text-xs font-semibold">
                  <a href={`/c/${church.slug}`} target="_blank" rel="noopener noreferrer">
                    <GlobeIcon className="h-3.5 w-3.5 mr-1" />
                    Visit
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About Our Church / Welcome Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={church.bio || ""}
              rows={3}
              placeholder="Share your church's mission, mandate, or a warm welcome message..."
              className="text-sm leading-relaxed"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="motto">Motto / Tagline</Label>
              <Input id="motto" name="motto" defaultValue={church.motto || ""} placeholder="e.g. Preparing a people for the Lord" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="denomination">Denomination</Label>
              <Input id="denomination" name="denomination" defaultValue={church.denomination || ""} placeholder="e.g. Pentecostal" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="year_founded">Year Founded</Label>
              <Input id="year_founded" name="year_founded" defaultValue={church.year_founded || ""} placeholder="e.g. 1995" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="church_website_url">Official Website</Label>
              <Input id="church_website_url" name="church_website_url" type="url" defaultValue={church.church_website_url || ""} placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line1">Physical Address (Line 1)</Label>
            <Input id="address_line1" name="address_line1" defaultValue={church.address_line1 || ""} placeholder="123 Faith Avenue" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address_line2">Physical Address (Line 2 / City / State)</Label>
            <Input id="address_line2" name="address_line2" defaultValue={church.address_line2 || ""} placeholder="Lagos, Nigeria" />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" defaultValue={church.country || ""} placeholder="e.g. United States, United Kingdom, Nigeria" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" name="timezone" defaultValue={church.timezone || "Africa/Lagos"} placeholder="e.g. Africa/Lagos, America/New_York" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
              <Share2Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg text-card-foreground">Social & Community Links</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Buttons shown on your church homepage and conference pages.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="instagram_url">Instagram Profile URL</Label>
            <Input
              id="instagram_url"
              name="instagram_url"
              type="url"
              defaultValue={church.instagram_url || ""}
              placeholder="https://instagram.com/yourchurch"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook_url">Facebook Page URL</Label>
            <Input
              id="facebook_url"
              name="facebook_url"
              type="url"
              defaultValue={church.facebook_url || ""}
              placeholder="https://facebook.com/yourchurch"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube_url">YouTube Channel URL</Label>
            <Input
              id="youtube_url"
              name="youtube_url"
              type="url"
              defaultValue={church.youtube_url || ""}
              placeholder="https://youtube.com/@yourchurch"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp_channel_url">WhatsApp Channel Link</Label>
            <Input
              id="whatsapp_channel_url"
              name="whatsapp_channel_url"
              type="url"
              defaultValue={church.whatsapp_channel_url || ""}
              placeholder="https://whatsapp.com/channel/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp_group_url">Default WhatsApp Group Link</Label>
            <Input
              id="whatsapp_group_url"
              name="whatsapp_group_url"
              type="url"
              defaultValue={church.whatsapp_group_url || church.whatsapp_url || ""}
              placeholder="https://chat.whatsapp.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">WhatsApp Phone / Registration Contact</Label>
            <Input
              id="whatsapp_number"
              name="whatsapp_number"
              type="tel"
              defaultValue={church.whatsapp_number || ""}
              placeholder="+2348012345678"
            />
            <p className="text-[11px] text-muted-foreground">Used for direct Click-to-Chat event registration on public pages.</p>
          </div>
        </CardContent>
      </Card>

      {/* Admin Details */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
              <UserCheckIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg text-card-foreground">Admin Account Information</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Internal administrator contact details.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="admin_name">Admin Full Name</Label>
            <Input id="admin_name" name="admin_name" defaultValue={church.admin_name || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin_email">Admin Email (Login Identity)</Label>
            <Input id="admin_email" defaultValue={church.admin_email} disabled className="bg-muted text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 shadow-md"
          disabled={isSaving}
        >
          <SaveIcon className="h-4 w-4" />
          {isSaving ? "Saving Changes..." : "Save Workspace Settings"}
        </Button>
      </div>
    </form>
  );
}
