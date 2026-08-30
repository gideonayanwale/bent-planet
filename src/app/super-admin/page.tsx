import Link from "next/link";
import {
  Building2Icon,
  UsersIcon,
  CalendarIcon,
  SparklesIcon,
  InboxIcon,
  MessageSquareIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createAdminClient } from "@/lib/supabase/admin";
import { AnalyticsChart } from "@/components/super-admin/analytics-chart";
import { AccessRequestsTable } from "@/components/super-admin/access-requests-table";
import { ChurchActionsMenu } from "@/components/super-admin/church-actions-menu";
import type { Database } from "@/types/database";

export default async function SuperAdminPage() {
  const adminClient = createAdminClient();

  const [
    churchCountResult,
    onboardedCountResult,
    accessRequestsResult,
    allChurchesResult,
    subscribersResult,
    conferencesResult,
    feedbackResult,
  ] = await Promise.all([
    adminClient.from("churches").select("*", { count: "exact", head: true }),
    adminClient
      .from("churches")
      .select("*", { count: "exact", head: true })
      .eq("onboarding_completed", true),
    adminClient
      .from("access_requests")
      .select("*")
      .order("created_at", { ascending: false }),
    adminClient
      .from("churches")
      .select("id, name, slug, admin_email, country, denomination, onboarding_completed, status, max_conferences_limit, max_emails_limit, created_at")
      .order("created_at", { ascending: false }),
    adminClient.from("subscribers").select("id, church_id, subscribed_at"),
    adminClient.from("conferences").select("id, church_id, created_at"),
    adminClient
      .from("feedback_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const accessRequests = (accessRequestsResult.data || []) as Database["public"]["Tables"]["access_requests"]["Row"][];
  const pendingRequests = accessRequests.filter((r) => r.status === "pending");
  const churches = allChurchesResult.data || [];
  const feedbackMessages = feedbackResult.data || [];
  const subscribers = subscribersResult.data || [];
  const conferences = conferencesResult.data || [];

  // Group subscriber counts by church
  const subscriberCountMap = new Map<string, number>();
  subscribers.forEach((s) => {
    if (s.church_id) {
      subscriberCountMap.set(s.church_id, (subscriberCountMap.get(s.church_id) || 0) + 1);
    }
  });

  // Group conference counts by church
  const conferenceCountMap = new Map<string, number>();
  conferences.forEach((c) => {
    if (c.church_id) {
      conferenceCountMap.set(c.church_id, (conferenceCountMap.get(c.church_id) || 0) + 1);
    }
  });

  const stats = [
    { label: "Total Churches", value: churchCountResult.count ?? 0, icon: Building2Icon, color: "text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20" },
    { label: "Active Onboarded", value: onboardedCountResult.count ?? 0, icon: SparklesIcon, color: "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20" },
    { label: "Pending Requests", value: pendingRequests.length, icon: InboxIcon, color: "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20" },
    { label: "Total Conferences", value: conferences.length, icon: CalendarIcon, color: "text-purple-500 bg-purple-500/10 dark:bg-purple-500/20" },
    { label: "Platform Subscribers", value: subscribers.length, icon: UsersIcon, color: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20" },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs px-3 py-1 font-semibold dark:bg-indigo-500/20">
            Super Admin Control Surface
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Platform Operations & Church CRM
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Review voluntary church access requests, dispatch invites, monitor workspace growth, and broadcast platform announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md">
            <Link href="/super-admin/invite">
              <Building2Icon className="mr-1.5 h-4 w-4" />
              Invite Church Directly
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-border bg-card shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-foreground font-heading mt-1">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-2xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Access Requests Inbox */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <InboxIcon className="h-5 w-5 text-indigo-500" />
                Voluntary Church Access Requests
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Churches that submitted the public &quot;Request Access&quot; form from the landing page.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-semibold border-border">
              {pendingRequests.length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <AccessRequestsTable initialRequests={accessRequests} />
        </CardContent>
      </Card>

      {/* Platform Analytics Growth Chart */}
      <AnalyticsChart
        initialSubscribers={subscribers.map((s) => ({ subscribed_at: s.subscribed_at }))}
        initialConferences={conferences.map((c) => ({ created_at: c.created_at }))}
      />

      {/* All Churches CRM Table */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <Building2Icon className="h-5 w-5 text-indigo-500" />
            Active & Provisioned Church Workspaces
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            All registered church ministries with subscriber metrics and direct live hub links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="text-xs font-semibold text-muted-foreground">Church Workspace</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Admin Email</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Location / Denomination</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Conferences</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Subscribers</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-muted-foreground">Hub Link</TableHead>
                  <TableHead className="text-right text-xs font-semibold text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {churches.length > 0 ? (
                  churches.map((church) => (
                    <TableRow key={church.id} className="hover:bg-secondary/30 transition border-border">
                      <TableCell>
                        <span className="font-bold text-xs text-foreground">{church.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-muted-foreground">{church.admin_email}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {church.country || "Global"} · {church.denomination || "Ministry"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[11px] font-bold border-border">
                          {conferenceCountMap.get(church.id) || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 border-indigo-500/30 dark:text-indigo-400">
                          {subscriberCountMap.get(church.id) || 0} leads
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-semibold ${
                            church.status === "suspended"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : church.onboarding_completed
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {church.status === "suspended"
                            ? "Suspended"
                            : church.onboarding_completed
                            ? "Active"
                            : "Onboarding Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="xs" className="text-xs text-indigo-400 hover:text-indigo-300">
                          <a href={`/c/${church.slug}`} target="_blank" rel="noopener noreferrer">
                            Visit Hub ↗
                          </a>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <ChurchActionsMenu
                          churchId={church.id}
                          churchName={church.name}
                          churchEmail={church.admin_email}
                          currentStatus={church.status || "active"}
                          maxConferences={church.max_conferences_limit ?? 20}
                          maxEmails={church.max_emails_limit ?? 5000}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                      No churches provisioned yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* In-App Feedback Messages */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <MessageSquareIcon className="h-5 w-5 text-indigo-500" />
            Recent Inquiries & Feedback
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Submissions from the public and church user feedback overlay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedbackMessages.length > 0 ? (
            <div className="space-y-3">
              {feedbackMessages.map((fb) => (
                <div key={fb.id} className="p-4 rounded-2xl border border-border bg-secondary/40 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{fb.user_name || fb.user_email}</span>
                      <Badge variant="outline" className="text-[10px] border-border">
                        {fb.category}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {fb.created_at ? new Date(fb.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{fb.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">No feedback messages yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
