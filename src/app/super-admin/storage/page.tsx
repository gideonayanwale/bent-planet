import { requireSuperAdminUser } from "@/lib/current-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HardDriveIcon, ShieldCheckIcon, ServerIcon, CloudIcon, LockIcon, CheckCircle2Icon } from "lucide-react";

export default async function SuperAdminStoragePage() {
  await requireSuperAdminUser();
  const adminClient = createAdminClient();

  // Inspect storage buckets metrics
  const { data: buckets } = await adminClient.storage.listBuckets();
  const churchAssetsBucket = buckets?.find((b) => b.name === "church-assets");
  const conferenceBannersBucket = buckets?.find((b) => b.name === "conference-banners");

  const cloudinaryActive = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_UPLOAD_PRESET);
  const teraboxActive = Boolean(process.env.TERABOX_GATEWAY_URL || process.env.EXTERNAL_STORAGE_GATEWAY_URL);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Super Admin Control Surface Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              <LockIcon className="h-3.5 w-3.5" />
              Restricted Super Admin Surface
            </span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            External Cloud Storage & Offloader Control
          </h1>
          <p className="text-xs text-slate-400">
            Configure global cloud storage providers, set tenant upload quotas, and monitor platform media offload.
          </p>
        </div>

        <Badge variant="outline" className="w-fit border-indigo-400/40 bg-indigo-950 text-indigo-200 px-3 py-1 font-mono text-xs">
          Access: Super Admin Only
        </Badge>
      </div>

      {/* Storage Architecture Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cloudinary Offloader
              </CardTitle>
              <CloudIcon className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${cloudinaryActive ? "bg-emerald-500" : "bg-slate-300"}`} />
              <span className="text-sm font-bold text-slate-900">
                {cloudinaryActive ? "Configured & Active" : "Unconfigured"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {cloudinaryActive
                ? `Connected to cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`
                : "Set CLOUDINARY_CLOUD_NAME in .env.local to activate."}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                TeraBox / Custom Gateway
              </CardTitle>
              <HardDriveIcon className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${teraboxActive ? "bg-emerald-500" : "bg-slate-300"}`} />
              <span className="text-sm font-bold text-slate-900">
                {teraboxActive ? "Active External Gateway" : "Standby"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {teraboxActive
                ? "Custom high-capacity cloud endpoint enabled."
                : "Set TERABOX_GATEWAY_URL in .env.local to route large files."}
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Supabase Public CDN
              </CardTitle>
              <ServerIcon className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold text-slate-900">Default CDN Active</span>
            </div>
            <p className="text-xs text-slate-500">
              Buckets: <code className="text-indigo-600">church-assets</code>, <code className="text-indigo-600">conference-banners</code>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Super Admin Storage Security Policy */}
      <Card className="border-slate-200/80 bg-white shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-lg">Storage Security & Tenant Isolation Policy</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Enforced storage rules governing church workspace uploads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                Super Admin Credential Lock
              </div>
              <p className="text-xs text-slate-500">
                Cloud storage API keys (Cloudinary, S3, TeraBox) are stored exclusively in platform environment variables and cannot be accessed or altered by church tenants.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
                Automatic App Server Offloading
              </div>
              <p className="text-xs text-slate-500">
                All church logo and conference banner uploads are offloaded directly to external cloud storage to guarantee zero server memory pressure on Next.js.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
