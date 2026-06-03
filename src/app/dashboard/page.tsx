import Link from "next/link";

import { signOutAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
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

function socialLinks(church: {
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  whatsapp_url: string | null;
}) {
  return [
    { label: "Instagram", value: church.instagram_url },
    { label: "Facebook", value: church.facebook_url },
    { label: "YouTube", value: church.youtube_url },
    { label: "WhatsApp", value: church.whatsapp_url },
  ].filter((item) => item.value);
}

export default async function DashboardPage() {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  const church = await getChurchByAdminEmail(adminClient, user.email ?? "");

  if (!church) {
    throw new Error("No church workspace is linked to this account yet.");
  }

  const links = socialLinks(church);

  return (
    <main className="min-h-screen">
      <section className="container py-12 sm:py-16">
        <div className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Badge className="bg-success/10 text-emerald-900 hover:bg-success/10">
                Church dashboard
              </Badge>
              <div className="space-y-2">
                <h1 className="font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  {church.name}
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-slate-600">
                  Your workspace is active. This page confirms tenant resolution, profile setup, and
                  protected access for the invited church admin.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <form action={signOutAction}>
                <Button variant="outline" type="submit">
                  Sign out
                </Button>
              </form>
              <Button asChild>
                <Link href="/">View public site</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <Card className="border-slate-200/70 bg-white/90 shadow-glow">
              <CardHeader>
                <CardTitle>Church identity</CardTitle>
                <CardDescription>Stored against the authenticated admin account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {church.logo_url ? (
                  <img
                    src={church.logo_url}
                    alt={`${church.name} logo`}
                    className="h-20 w-20 rounded-2xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-500">
                    No logo
                  </div>
                )}

                <div className="space-y-3 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-900">Admin email:</span> {church.admin_email}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Admin name:</span> {church.admin_name}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Country:</span> {church.country}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Timezone:</span> {church.timezone}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Public slug:</span> /c/{church.slug}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-slate-200/70 bg-white/90">
                <CardHeader>
                  <CardTitle>Church bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-7 text-slate-600">{church.bio}</p>
                </CardContent>
              </Card>

              <Card className="border-slate-200/70 bg-white/90">
                <CardHeader>
                  <CardTitle>Connected social links</CardTitle>
                  <CardDescription>These links were captured during church onboarding.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {links.length === 0 ? (
                    <p className="text-sm text-slate-500">No social links have been added yet.</p>
                  ) : (
                    links.map((link) => (
                      <a
                        key={link.label}
                        href={link.value ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-accent/40 hover:text-accent"
                      >
                        <span>{link.label}</span>
                        <span>Open</span>
                      </a>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200/70 bg-white/90">
                <CardHeader>
                  <CardTitle>Next feature slice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-600">
                    Conference creation, public conference pages, and subscriber capture are the
                    next major milestones on top of this authenticated foundation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
