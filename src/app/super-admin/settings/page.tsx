import { requireSuperAdminUser } from "@/lib/current-user";
import { getServerEnv } from "@/lib/env";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SuperAdminSettingsPage() {
  await requireSuperAdminUser();
  const env = getServerEnv();

  const superAdmins = (env.SUPER_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-900">Platform Settings</h1>
        <p className="text-slate-600 mt-1">Global configuration and platform environment variables.</p>
      </div>

      <Card className="border-slate-200/70 shadow-sm bg-white/90">
        <CardHeader>
          <CardTitle>Authorized Platform Owners</CardTitle>
          <CardDescription>
            These emails have full access to invite churches and view platform analytics.
            Configured via <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">SUPER_ADMIN_EMAILS</code> in your .env file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {superAdmins.length > 0 ? (
              superAdmins.map((email) => (
                <Badge key={email} className="bg-primary/10 text-primary hover:bg-primary/20 text-sm py-1.5 px-3">
                  {email}
                </Badge>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No super admins configured.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/70 shadow-sm bg-white/90">
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
          <CardDescription>
            Current status of essential third-party integrations (Read-only).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-700">OpenAI API</span>
                <Badge variant={env.OPENAI_API_KEY ? "default" : "destructive"} className={env.OPENAI_API_KEY ? "bg-green-100 text-green-800" : ""}>
                  {env.OPENAI_API_KEY ? "Configured" : "Missing"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Used for generating AI conference content.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-700">Resend API</span>
                <Badge variant={env.RESEND_API_KEY ? "default" : "destructive"} className={env.RESEND_API_KEY ? "bg-green-100 text-green-800" : ""}>
                  {env.RESEND_API_KEY ? "Configured" : "Missing"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Used for transactional emails and broadcasts.</p>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-700">App URL</span>
                <code className="text-sm text-slate-600">{env.NEXT_PUBLIC_APP_URL || "Not set"}</code>
              </div>
              <p className="text-xs text-slate-500">Base URL for absolute links (emails, OG images).</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
