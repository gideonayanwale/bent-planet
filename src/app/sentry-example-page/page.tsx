"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { trackEvent } from "@/lib/posthog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircleIcon, CheckCircle2Icon, ShieldAlertIcon, ActivityIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function SentryExamplePage() {
  const [clientStatus, setClientStatus] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<string | null>(null);
  const [posthogStatus, setPosthogStatus] = useState<string | null>(null);
  const [isTriggeringServer, setIsTriggeringServer] = useState(false);

  const handleClientError = () => {
    try {
      setClientStatus("Triggering client exception...");
      throw new Error("Sentry Client Test Error: Sample client-side exception triggered from /sentry-example-page");
    } catch (error) {
      Sentry.captureException(error);
      setClientStatus("Client error captured and dispatched to Sentry!");
    }
  };

  const handleServerError = async () => {
    try {
      setIsTriggeringServer(true);
      setServerStatus("Calling server API test route...");
      const res = await fetch("/api/sentry-example-api");
      if (!res.ok) {
        setServerStatus("Server error successfully captured and sent to Sentry!");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setServerStatus(`Server call failed: ${error.message}`);
    } finally {
      setIsTriggeringServer(false);
    }
  };

  const handlePosthogEvent = () => {
    trackEvent("test_analytics_event", {
      source: "sentry_example_page",
      timestamp: new Date().toISOString(),
    });
    setPosthogStatus("Custom event 'test_analytics_event' captured in PostHog!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                <ActivityIcon className="h-3 w-3" /> Telemetry Diagnostics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sentry & PostHog Verification Hub
            </h1>
            <p className="text-sm text-slate-400">
              Verify real-time error tracking and analytics ingestion for Bent Planet.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-800 text-slate-300 hover:bg-slate-900">
            <Link href="/">
              <ArrowLeftIcon className="h-3.5 w-3.5 mr-1.5" /> Back to Home
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Client-Side Sentry Test */}
          <Card className="bg-slate-900/80 border-slate-800 text-slate-100 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <ShieldAlertIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base text-white">Client Error Test</CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Triggers a browser JavaScript exception.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Captures stack trace, device metadata, breadcrumbs, and browser session context.
              </p>
              <Button
                onClick={handleClientError}
                variant="destructive"
                size="sm"
                className="w-full rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Trigger Client Sentry Error
              </Button>
              {clientStatus && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400">
                  <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                  <span>{clientStatus}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Server-Side Sentry Test */}
          <Card className="bg-slate-900/80 border-slate-800 text-slate-100 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <AlertCircleIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base text-white">Server API Error Test</CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Triggers an error inside a Next.js App Router API.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Sends a request to <code className="text-amber-400 font-mono text-[11px]">/api/sentry-example-api</code> to capture backend server logs.
              </p>
              <Button
                onClick={handleServerError}
                disabled={isTriggeringServer}
                size="sm"
                className="w-full rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isTriggeringServer ? "Triggering..." : "Trigger Server Sentry Error"}
              </Button>
              {serverStatus && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400">
                  <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                  <span>{serverStatus}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* PostHog Event Test */}
          <Card className="bg-slate-900/80 border-slate-800 text-slate-100 shadow-xl sm:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <ActivityIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base text-white">PostHog Analytics Test</CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Dispatches a custom event with properties to PostHog.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Emits an event to PostHog to verify that pageviews, session recording, and custom conversions are active.
              </p>
              <Button
                onClick={handlePosthogEvent}
                size="sm"
                className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Send Test PostHog Event
              </Button>
              {posthogStatus && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400">
                  <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                  <span>{posthogStatus}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2 text-xs text-slate-400">
          <p className="font-semibold text-slate-300">💡 Next Steps:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Ensure <code className="text-indigo-300 font-mono">NEXT_PUBLIC_SENTRY_DSN</code> is configured in your environment.</li>
            <li>Click the buttons above to test and verify incoming issues on your <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline font-medium">Sentry Dashboard</a> (Org: <span className="font-mono text-slate-300">gideon-inioluwa-ayanwale</span>, Project: <span className="font-mono text-slate-300">bent-planet</span>).</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
