import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/forms/login-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/current-user";
import { getAppRouteForEmail } from "@/lib/auth";

type LoginPageProps = {
  searchParams?: {
    email?: string;
    onboarding?: string;
  };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user?.email) {
    redirect(getAppRouteForEmail(user.email));
  }

  const defaultEmail = typeof searchParams?.email === "string" ? searchParams.email : "";
  const showOnboardingNote = searchParams?.onboarding === "complete";

  return (
    <main className="min-h-screen">
      <section className="container py-12 sm:py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge className="bg-accent/10 text-accent hover:bg-accent/10">Secure workspace</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                Sign in to manage your Bent Planet workspace.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Super admins manage invitations. Church teams complete onboarding once, then return
                here to access their dashboard.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-slate-200/70 bg-white/80 shadow-glow backdrop-blur">
                <CardHeader>
                  <ShieldCheck className="h-8 w-8 text-accent" />
                  <CardTitle>Invite-only access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600">
                    Churches only join Bent Planet through a super-admin invitation and one-time
                    onboarding link.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200/70 bg-white/80 shadow-glow backdrop-blur">
                <CardHeader>
                  <ArrowRight className="h-8 w-8 text-highlight" />
                  <CardTitle>Church onboarding</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600">
                    New churches set their password, profile, timezone, and logo during onboarding.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to Bent Planet</Link>
            </Button>
          </div>

          <Card className="border-slate-200/70 bg-white/90 shadow-glow backdrop-blur">
            <CardHeader className="space-y-3">
              <CardTitle className="text-3xl">Account sign-in</CardTitle>
              <CardDescription>
                Use the email and password tied to your Bent Planet account.
              </CardDescription>
              {showOnboardingNote ? (
                <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-emerald-900">
                  Onboarding is complete. Sign in with the password you just created.
                </div>
              ) : null}
            </CardHeader>
            <CardContent>
              <LoginForm defaultEmail={defaultEmail} />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
