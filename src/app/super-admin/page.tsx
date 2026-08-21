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
      .select("id, name, slug, admin_email, country, denomination, onboarding_completed, created_at")
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
    { label: "Total Churches", value: churchCountResult.count ?? 0, icon: Building2Icon, color: "text-indigo-600 bg-indigo-50" },
    { label: "Active Onboarded", value: onboardedCountResult.count ?? 0, icon: SparklesIcon, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Requests", value: pendingRequests.length, icon: InboxIcon, color: "text-amber-600 bg-amber-50" },
    { label: "Total Conferences", value: conferences.length, icon: CalendarIcon, color: "text-purple-600 bg-purple-50" },
    { label: "Platform Subscribers", value: subscribers.length, icon: UsersIcon, color: "text-blue-600 bg-blue-50" },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Top Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs px-3 py-1 font-semibold">
            Super Admin Control Surface
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Platform Operations & Church CRM
          </h1>
          <p className="max-w-3xl text-sm text-slate-600">
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
            <Card key={idx} className="border-slate-200/80 bg-white shadow-2xs">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-extrabold text-slate-900 font-heading mt-1">{stat.value}</p>
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
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <InboxIcon className="h-5 w-5 text-indigo-600" />
                Voluntary Church Access Requests
              </CardTitle>
              <CardDescription className="text-xs">
                Churches that submitted the public &quot;Request Access&quot; form from the landing page.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-slate-50 text-xs font-semibold">
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
        subscribers={subscribers.map((s) => ({ subscribed_at: s.subscribed_at }))}
        conferences={conferences.map((c) => ({ created_at: c.created_at }))}
      />

      {/* All Churches CRM Table */}
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2Icon className="h-5 w-5 text-indigo-600" />
            Active & Provisioned Church Workspaces
          </CardTitle>
          <CardDescription className="text-xs">
            All registered church ministries with subscriber metrics and direct live hub links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-semibold">Church Workspace</TableHead>
                  <TableHead className="text-xs font-semibold">Admin Email</TableHead>
                  <TableHead className="text-xs font-semibold">Location / Denomination</TableHead>
                  <TableHead className="text-xs font-semibold">Conferences</TableHead>
                  <TableHead className="text-xs font-semibold">Subscribers</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Hub Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {churches.length > 0 ? (
                  churches.map((church) => (
                    <TableRow key={church.id} className="hover:bg-slate-50/70 transition">
                      <TableCell>
                        <span className="font-bold text-xs text-slate-900">{church.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-slate-600">{church.admin_email}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-500">
                          {church.country || "Global"} · {church.denomination || "Ministry"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[11px] font-bold">
                          {conferenceCountMap.get(church.id) || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border-indigo-200">
                          {subscriberCountMap.get(church.id) || 0} leads
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-semibold ${
                            church.onboarding_completed
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {church.onboarding_completed ? "Active" : "Onboarding Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="xs" className="text-xs text-indigo-600 hover:text-indigo-700">
                          <a href={`/c/${church.slug}`} target="_blank" rel="noopener noreferrer">
                            Visit Hub ↗
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500 text-xs">
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
      <Card className="border-slate-200/80 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquareIcon className="h-5 w-5 text-indigo-600" />
            Recent Inquiries & Feedback
          </CardTitle>
          <CardDescription className="text-xs">
            Submissions from the public and church user feedback overlay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feedbackMessages.length > 0 ? (
            <div className="space-y-3">
              {feedbackMessages.map((fb) => (
                <div key={fb.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{fb.user_name || fb.user_email}</span>
                      <Badge variant="outline" className="text-[10px] bg-white">
                        {fb.category}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {fb.created_at ? new Date(fb.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{fb.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-6">No feedback messages yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
