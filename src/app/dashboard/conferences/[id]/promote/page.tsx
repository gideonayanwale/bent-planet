import { notFound } from "next/navigation";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { getConferenceById } from "@/lib/conferences";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { Input } from "@/components/ui/input";
import { PosterGenerator } from "@/components/poster-generator";

export default async function PromoteConferencePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  const church = await getChurchByAdminEmail(adminClient, user.email!);

  if (!church) {
    return <div>Church not found</div>;
  }

  const conference = await getConferenceById(adminClient, params.id);
  
  if (!conference || conference.church_id !== church.id) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bentplanet.com";
  const publicUrl = `${baseUrl}/c/${church.slug}/${conference.slug}`;
  const displayUrl = conference.short_url || publicUrl;
  const socialCaptions = (conference.social_captions as Record<string, string>) || {};

  const utmLinks = [
    { label: "Instagram Bio", url: `${displayUrl}?utm_source=instagram&utm_medium=bio&utm_campaign=launch` },
    { label: "WhatsApp Broadcast", url: `${displayUrl}?utm_source=whatsapp&utm_medium=broadcast&utm_campaign=launch` },
    { label: "WhatsApp Channel", url: `${displayUrl}?utm_source=whatsapp&utm_medium=channel&utm_campaign=launch` },
    { label: "Facebook Post", url: `${displayUrl}?utm_source=facebook&utm_medium=post&utm_campaign=launch` },
    { label: "Twitter / X", url: `${displayUrl}?utm_source=twitter&utm_medium=tweet&utm_campaign=launch` },
    { label: "Email Campaign", url: `${displayUrl}?utm_source=email&utm_medium=newsletter&utm_campaign=launch` },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900">Promote: {conference.title}</h1>
        <p className="text-slate-600 mt-1">Share your conference with your audience using AI captions, WhatsApp channel updates, short Bitly links, and graphic posters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-indigo-200/80 bg-indigo-50/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Shortened Conference Link</CardTitle>
              {conference.short_url && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                  Bitly Shortened
                </span>
              )}
            </div>
            <CardDescription>Shareable URL for your attendees to register.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <Input readOnly value={displayUrl} className="bg-white font-mono text-sm" />
              <CopyButton textToCopy={displayUrl} className="w-32" />
            </div>
            {conference.short_url && (
              <p className="text-xs text-slate-500">
                Original URL: <span className="font-mono">{publicUrl}</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-emerald-200/80 bg-emerald-50/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-emerald-950 flex items-center gap-2">
              WhatsApp Integration Links
            </CardTitle>
            <CardDescription className="text-emerald-800">Quick-join links for your attendees.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-emerald-900 block mb-1">WhatsApp Group Invite Link</span>
              <div className="flex gap-3">
                <Input
                  readOnly
                  value={conference.whatsapp_group_url || church.whatsapp_group_url || "Not set"}
                  className="bg-white font-mono text-xs"
                />
                {(conference.whatsapp_group_url || church.whatsapp_group_url) && (
                  <CopyButton textToCopy={(conference.whatsapp_group_url || church.whatsapp_group_url)!} />
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-900 block mb-1">WhatsApp Channel Link</span>
              <div className="flex gap-3">
                <Input
                  readOnly
                  value={conference.whatsapp_channel_url || church.whatsapp_channel_url || "Not set"}
                  className="bg-white font-mono text-xs"
                />
                {(conference.whatsapp_channel_url || church.whatsapp_channel_url) && (
                  <CopyButton textToCopy={(conference.whatsapp_channel_url || church.whatsapp_channel_url)!} />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Poster Generator */}
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>AI Graphics & Poster Generator</CardTitle>
          <CardDescription>Customize and download high-resolution promotional posters ready to share on Instagram, WhatsApp, or Facebook.</CardDescription>
        </CardHeader>
        <CardContent>
          <PosterGenerator
            churchName={church.name}
            title={conference.title}
            speaker={conference.speaker_name}
            date={conference.conference_date}
            time={conference.conference_time}
            theme={conference.theme}
            bannerUrl={conference.banner_url}
          />
        </CardContent>
      </Card>

      {/* UTM Links */}
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Platform Specific Trackable Links (UTM)</CardTitle>
          <CardDescription>Track where your attendees and signups are coming from.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {utmLinks.map((utm) => (
            <div key={utm.label} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
              <span className="font-medium text-sm text-slate-700 min-w-[160px]">{utm.label}</span>
              <Input readOnly value={utm.url} className="bg-white font-mono text-xs flex-1" />
              <CopyButton textToCopy={utm.url} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Social Media Captions */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">AI-Generated Social Media Captions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(socialCaptions).map(([platform, caption]: [string, string]) => (
            <Card key={platform} className="flex flex-col h-full shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize text-lg">{platform} Caption</CardTitle>
                  <CopyButton textToCopy={`${caption}\n\nRegister here: ${publicUrl}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-grow">
                <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed font-sans">
                  {caption}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
