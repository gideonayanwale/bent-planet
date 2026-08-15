import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";
import { AnalyticsChart } from "@/components/super-admin/analytics-chart";

function formatDate(date?: string | null) {
  if (!date) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default async function SuperAdminPage() {
  const adminClient = createAdminClient();
  const [
    churchCountResult,
    onboardedCountResult,
    pendingInviteCountResult,
    recentChurchesResult,
    recentInvitesResult,
    subscribersResult,
    conferencesResult,
  ] = await Promise.all([
    adminClient.from("churches").select("*", { count: "exact", head: true }),
    adminClient
      .from("churches")
      .select("*", { count: "exact", head: true })
      .eq("onboarding_completed", true),
    adminClient.from("invites").select("*", { count: "exact", head: true }).eq("status", "pending"),
    adminClient
      .from("churches")
      .select("id,name,slug,admin_email,onboarding_completed,created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    adminClient
      .from("invites")
      .select("id,church_name,email,status,invited_at")
      .order("invited_at", { ascending: false })
      .limit(6),
    adminClient.from("subscribers").select("subscribed_at"),
    adminClient.from("conferences").select("created_at"),
  ]);

  if (
    churchCountResult.error ||
    onboardedCountResult.error ||
    pendingInviteCountResult.error ||
    recentChurchesResult.error ||
    recentInvitesResult.error
  ) {
    throw new Error("Failed to load the super-admin overview.");
  }

  const stats = [
    {
      label: "Total churches",
      value: churchCountResult.count ?? 0,
    },
    {
      label: "Onboarded churches",
      value: onboardedCountResult.count ?? 0,
    },
    {
      label: "Pending invites",
      value: pendingInviteCountResult.count ?? 0,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge className="bg-accent/10 text-accent hover:bg-accent/10">
            Platform operations
          </Badge>
          <div className="space-y-2">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-primary">
              Invite churches and monitor onboarding progress.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              This is the first live Bent Planet control surface. Start by inviting church admins,
              then track which workspaces have completed onboarding.
            </p>
          </div>
        </div>

        <Button asChild size="lg">
          <Link href="/super-admin/invite">Invite a church</Link>
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-200/70 bg-white/90">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-4xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <AnalyticsChart 
        initialSubscribers={subscribersResult.data || []} 
        initialConferences={conferencesResult.data || []} 
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200/70 bg-white/90">
          <CardHeader>
            <CardTitle>Recent churches</CardTitle>
            <CardDescription>Placeholder and onboarded workspaces created in the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentChurchesResult.data.length === 0 ? (
              <p className="text-sm text-slate-500">No churches have been invited yet.</p>
            ) : (
              recentChurchesResult.data.map((church) => (
                <div
                  key={church.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">{church.name}</p>
                      <p className="text-sm text-slate-500">
                        {church.admin_email} · /c/{church.slug}
                      </p>
                    </div>
                    <Badge
                      className={
                        church.onboarding_completed
                          ? "bg-success/10 text-emerald-900 hover:bg-success/10"
                          : "bg-highlight/15 text-highlight hover:bg-highlight/15"
                      }
                    >
                      {church.onboarding_completed ? "Onboarded" : "Pending setup"}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Created {formatDate(church.created_at)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200/70 bg-white/90">
          <CardHeader>
            <CardTitle>Recent invites</CardTitle>
            <CardDescription>Every invite sends a one-time onboarding link to the church admin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInvitesResult.data.length === 0 ? (
              <p className="text-sm text-slate-500">No invites have been sent yet.</p>
            ) : (
              recentInvitesResult.data.map((invite) => (
                <div
                  key={invite.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900">{invite.church_name}</p>
                      <p className="text-sm text-slate-500">{invite.email}</p>
                    </div>
                    <Badge
                      className={
                        invite.status === "accepted"
                          ? "bg-success/10 text-emerald-900 hover:bg-success/10"
                          : "bg-highlight/15 text-highlight hover:bg-highlight/15"
                      }
                    >
                      {invite.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Sent {formatDate(invite.invited_at)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
