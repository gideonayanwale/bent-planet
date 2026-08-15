import Link from "next/link";
import {
  CalendarIcon,
  UsersIcon,
  MailIcon,
  PlusIcon,
  SparklesIcon,
  GlobeIcon,
  ArrowUpRightIcon,
  RadioIcon,
  CheckCircle2Icon,
  ClockIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getChurchByAdminEmail } from "@/lib/churches";
import { requireChurchUser } from "@/lib/current-user";
import { createAdminClient } from "@/lib/supabase/admin";
import { getConferencesByChurchId } from "@/lib/conferences";
import { AnalyticsChart } from "@/components/analytics-chart";

export default async function DashboardPage() {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  const church = await getChurchByAdminEmail(adminClient, user.email ?? "");

  if (!church) {
    throw new Error("No church workspace is linked to this account yet.");
  }

  const conferences = await getConferencesByChurchId(adminClient, church.id);

  // Fetch subscriber count
  const { count: subscriberCount } = await adminClient
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("church_id", church.id);

  // Fetch emails sent count
  const { count: emailCount } = await adminClient
    .from("email_log")
    .select("*", { count: "exact", head: true })
    .eq("church_id", church.id);

  const publishedCount = conferences.filter((c) => c.status === "published").length;
  const totalSubs = subscriberCount ?? 0;
  const totalEmails = emailCount ?? 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md">
              <SparklesIcon className="h-3.5 w-3.5 text-amber-300" />
              Active Ministry Workspace
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome, {church.name}
          </h1>
          <p className="max-w-2xl text-sm text-indigo-100/90 leading-relaxed">
            Manage your live conferences, grow your subscriber audience, and broadcast Spirit-filled updates directly to your members.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="default" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold shadow-md gap-2">
            <Link href="/dashboard/conferences/new">
              <PlusIcon className="h-4 w-4 text-indigo-600" />
              New AI Conference
            </Link>
          </Button>

          <Button asChild variant="outline" size="default" className="border-white/20 bg-white/10 text-white hover:bg-white/20 gap-2">
            <Link href={`/c/${church.slug}`} target="_blank">
              <GlobeIcon className="h-4 w-4" />
              View Ministry Hub
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200/80 bg-white/90 shadow-xs hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Subscribers
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <UsersIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalSubs}</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <span>↑ 100% organic growth</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-xs hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Conferences
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <CalendarIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{publishedCount}</div>
            <p className="text-xs text-slate-500 mt-1">
              {conferences.length - publishedCount} drafts in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-xs hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Broadcast Emails Sent
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <MailIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalEmails}</div>
            <p className="text-xs text-slate-500 mt-1">
              Automated & custom broadcasts
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90 shadow-xs hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Platform Status
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <RadioIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">Verified</div>
            <p className="text-xs text-slate-500 mt-1">
              Slug: <code className="text-indigo-600 font-medium">/c/{church.slug}</code>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart & Quick Email Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-200/80 bg-white/90 shadow-xs">
          <CardContent className="p-6">
            <AnalyticsChart />
          </CardContent>
        </Card>

        {/* Quick Email Broadcast Hub */}
        <Card className="border-slate-200/80 bg-white/90 shadow-xs flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <MailIcon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Email Broadcast</CardTitle>
                <CardDescription className="text-xs">Nurture your conference attendees</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Total Reachable Audience:</span>
                <span className="font-bold text-slate-900">{totalSubs} Subscribers</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Send live stream notifications, sermon notes, or devotional reminders in 1 click.
              </p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 font-semibold">
              <Link href="/dashboard/emails">
                Open Email Command Center
                <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Conferences Table / Grid */}
      <Card className="border-slate-200/80 bg-white/90 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Ministry Conferences</CardTitle>
            <CardDescription className="text-xs">
              All live, scheduled, and past online conferences created for your church.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
            <Link href="/dashboard/conferences/new">
              <PlusIcon className="h-4 w-4" />
              Create Conference
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {conferences.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900">No conferences yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
                Use our AI Generator to create your first online conference page in under 60 seconds.
              </p>
              <Button asChild size="sm" className="bg-indigo-600 text-white">
                <Link href="/dashboard/conferences/new">Generate First Conference</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {conferences.map((conf) => (
                <div
                  key={conf.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          conf.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {conf.status === "published" ? (
                          <>
                            <CheckCircle2Icon className="h-3 w-3" /> Published
                          </>
                        ) : (
                          <>
                            <ClockIcon className="h-3 w-3" /> Draft
                          </>
                        )}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {new Date(conf.conference_date || conf.created_at || Date.now()).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h4 className="font-heading text-base font-bold text-slate-900 line-clamp-1">
                      {conf.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {conf.caption || conf.full_description || "No description provided."}
                    </p>

                    {conf.speaker_name && (
                      <p className="text-[11px] text-slate-500 font-medium">
                        🗣️ <span className="text-slate-700">{conf.speaker_name}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                      <Link href={`/dashboard/conferences/${conf.id}`}>Manage</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700">
                      <Link href={`/c/${church.slug}/${conf.slug}`} target="_blank" className="flex items-center gap-1">
                        Public Page <ArrowUpRightIcon className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
