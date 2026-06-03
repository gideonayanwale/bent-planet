import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pillars = [
  "Invite-only church onboarding",
  "AI-generated conference pages",
  "Church-specific subscriber ownership",
  "Automated conference email sequences",
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="container py-12 sm:py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6">
            <Badge className="bg-highlight/15 text-highlight hover:bg-highlight/15">
              Christian conference SaaS
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
                Bent Planet gives churches a serious digital home for online conferences.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Create conference pages, grow subscribers, and automate email communication from
                one invite-only platform built for ministry teams.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/login">Church Login</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/super-admin">Super Admin</Link>
              </Button>
            </div>
          </div>

          <Card className="border-slate-200/70 bg-white/80 shadow-glow backdrop-blur">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Phase 1 foundation is in place</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pillars.map((pillar) => (
                <div key={pillar} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="font-medium text-slate-800">{pillar}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

