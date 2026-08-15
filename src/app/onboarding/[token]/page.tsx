import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { OnboardingForm } from "@/components/forms/onboarding-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";

type OnboardingPageProps = {
  params: {
    token: string;
  };
};

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const adminClient = createAdminClient();
  const [inviteResult, churchResult] = await Promise.all([
    adminClient.from("invites").select("*").eq("token", params.token).maybeSingle(),
    adminClient.from("churches").select("*").eq("onboarding_token", params.token).maybeSingle(),
  ]);

  if (inviteResult.error || churchResult.error) {
    throw new Error("Failed to load the onboarding invitation.");
  }

  const invite = inviteResult.data;
  const church = churchResult.data;
  const isValidInvite =
    Boolean(invite?.email) &&
    invite?.status === "pending" &&
    Boolean(church) &&
    !church?.onboarding_completed;

  if (!isValidInvite) {
    return (
      <main className="min-h-screen">
        <section className="container flex min-h-screen items-center justify-center py-12">
          <Card className="max-w-xl border-slate-200/70 bg-white/90 shadow-glow">
            <CardHeader className="space-y-3">
              <Badge className="w-fit bg-destructive/10 text-destructive hover:bg-destructive/10">
                Link unavailable
              </Badge>
              <CardTitle className="text-3xl">This onboarding link is no longer valid.</CardTitle>
              <CardDescription className="text-base leading-7">
                The invite may have been used already or replaced with a newer onboarding email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild>
                <Link href="/login">Go to login</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  const defaultValues = {
    churchName: church?.name ?? invite?.church_name ?? "",
    adminName: church?.admin_name ?? "",
    country: church?.country ?? "",
    timezone: church?.timezone ?? "Africa/Lagos",
    bio: church?.bio ?? "",
    instagramUrl: church?.instagram_url ?? "",
    facebookUrl: church?.facebook_url ?? "",
    youtubeUrl: church?.youtube_url ?? "",
    whatsappUrl: church?.whatsapp_url ?? "",
  };

  return (
    <main className="min-h-screen">
      <section className="container py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Link href="/" className="inline-block transition-opacity hover:opacity-85">
              <BrandLogo iconSize={44} />
            </Link>
            <Badge className="bg-accent/10 text-accent hover:bg-accent/10">Church onboarding</Badge>
            <div className="space-y-4">
              <h1 className="font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                Activate your Bent Planet workspace.
              </h1>
              <p className="text-lg leading-8 text-slate-600">
                Finish your church setup once, then Bent Planet will take you straight into the
                dashboard.
              </p>
            </div>

            <Card className="border-slate-200/70 bg-white/90 shadow-glow">
              <CardHeader>
                <CardTitle>What this setup covers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Create your church admin password",
                  "Upload your church logo",
                  "Set your church profile and timezone",
                  "Connect your ministry social links",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                    <p className="text-sm font-medium text-slate-800">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200/70 bg-white/95 shadow-glow">
            <CardHeader className="space-y-3">
              <CardTitle className="text-3xl">Complete church setup</CardTitle>
              <CardDescription className="text-base leading-7">
                This invite is reserved for <strong>{invite?.email}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OnboardingForm
                adminEmail={invite?.email ?? ""}
                token={params.token}
                defaultValues={defaultValues}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
