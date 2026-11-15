import type { Metadata } from "next";
import Link from "next/link";
import { SparklesIcon, ArrowRightIcon, ShieldCheckIcon, KeyRoundIcon, Building2Icon, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/brand-logo";
import { PublicFooter } from "@/components/public-footer";

export const metadata: Metadata = {
  title: "Register & Request Church Workspace",
  description:
    "Join OIKODARA to automate church conferences, livestream distribution, and attendee lead ownership.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-8">
          <Link href="/">
            <BrandLogo iconSize={38} />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">Already have a workspace?</span>
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero & Registration Gateway */}
      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>Invite-Only Ministry Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight text-foreground">
            Get Started with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              OIKODARA
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            OIKODARA provides isolated, high-converting digital environments for church conferences, live broadcasts, and attendee nurture. Choose your pathway below to access your workspace.
          </p>
        </div>

        {/* Action Pathways */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Pathway 1: Request Workspace Access */}
          <Card className="border-indigo-500/30 bg-card shadow-xl rounded-3xl overflow-hidden flex flex-col justify-between hover:border-indigo-500/60 transition-all duration-300 group">
            <div>
              <div className="p-8 bg-gradient-to-br from-indigo-900 to-slate-950 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                    <Building2Icon className="w-6 h-6" />
                  </div>
                  <Badge className="bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/30 border-indigo-400/30 font-mono text-[10px]">
                    New Churches
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold font-heading text-white">
                  Request Church Workspace
                </CardTitle>
                <CardDescription className="text-xs text-slate-300 leading-relaxed">
                  Submit your church and ministry details. Our team verifies your ministry and issues your dedicated workspace onboarding link.
                </CardDescription>
              </div>

              <CardContent className="p-8 space-y-4">
                <div className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>60-Second AI Event Creator with auto-generated agendas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>100% church attendee data ownership (CSV export anytime)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>WhatsApp community sync & automated email broadcasts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dedicated subdomain & cloud flyer CDN storage</span>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-8 pt-0">
              <Button asChild className="w-full btn-gradient text-xs font-bold h-11 shadow-md">
                <Link href="/request-access" className="flex items-center justify-center gap-2">
                  Apply for Church Access <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Pathway 2: Have an Onboarding Token or Account */}
          <Card className="border-border bg-card shadow-xl rounded-3xl overflow-hidden flex flex-col justify-between hover:border-border/80 transition-all duration-300">
            <div>
              <div className="p-8 bg-secondary/40 border-b border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <KeyRoundIcon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    Verified Invites
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold font-heading text-foreground">
                  Received an Invitation?
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                  If our team or a platform administrator has already issued your church an onboarding invitation link, you can activate it directly.
                </CardDescription>
              </div>

              <CardContent className="p-8 space-y-6">
                <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-2">
                  <span className="text-xs font-semibold text-foreground block">Check Your Email</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Look for an email from <code className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">OIKODARA Invitations</code> containing your unique workspace setup token.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheckIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Each token is cryptographically isolated to your church</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheckIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Single-use verification token expires automatically upon completion</span>
                  </div>
                </div>
              </CardContent>
            </div>

            <div className="p-8 pt-0 space-y-3">
              <Button asChild variant="outline" className="w-full text-xs font-bold h-11">
                <Link href="/login">
                  Already Onboarded? Sign In to Workspace
                </Link>
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                Need assistance?{" "}
                <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Contact support desk
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
