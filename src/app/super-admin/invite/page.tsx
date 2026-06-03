import Link from "next/link";

import { InviteChurchForm } from "@/components/forms/invite-church-form";
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

function formatDate(date?: string | null) {
  if (!date) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default async function SuperAdminInvitePage() {
  const adminClient = createAdminClient();
  const { data: recentInvites, error } = await adminClient
    .from("invites")
    .select("id,church_name,email,status,invited_at")
    .order("invited_at", { ascending: false })
    .limit(8);

  if (error) {
    throw new Error("Failed to load invite data.");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="border-slate-200/70 bg-white/90 shadow-glow">
        <CardHeader className="space-y-3">
          <Badge className="w-fit bg-highlight/15 text-highlight hover:bg-highlight/15">
            New church workspace
          </Badge>
          <CardTitle className="text-3xl">Send a one-time onboarding link</CardTitle>
          <CardDescription className="text-base leading-7">
            Bent Planet will create or refresh the church placeholder record, generate a secure
            onboarding token, and email the admin immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <InviteChurchForm />

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-medium text-slate-900">What happens next</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>The invite creates or refreshes a church placeholder.</li>
              <li>The admin receives a secure onboarding link by email.</li>
              <li>Once setup is complete, the church lands in its dashboard.</li>
            </ul>
          </div>

          <Button asChild variant="outline">
            <Link href="/super-admin">Back to overview</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-slate-200/70 bg-white/90">
        <CardHeader>
          <CardTitle>Latest invite activity</CardTitle>
          <CardDescription>Track whether each church has completed its setup flow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentInvites.length === 0 ? (
            <p className="text-sm text-slate-500">No invite activity yet.</p>
          ) : (
            recentInvites.map((invite) => (
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
    </div>
  );
}
