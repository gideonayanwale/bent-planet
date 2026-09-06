import Link from "next/link";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { ConferenceTableClient } from "@/components/conference-table-client";
import type { Database } from "@/types/database";

type ConferenceWithCount = Database["public"]["Tables"]["conferences"]["Row"] & {
  subscribers?: { count: number }[];
};

export default async function ConferencesPage() {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  
  const church = await getChurchByAdminEmail(adminClient, user.email!);
  
  if (!church) {
    return <div className="p-8 text-center text-slate-600">Church workspace not found.</div>;
  }

  // Fetch conferences and their subscriber counts
  const { data: conferences, error } = await adminClient
    .from("conferences")
    .select("*, subscribers(count)")
    .eq("church_id", church.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load conferences", error);
  }

  const typedConferences = (conferences as unknown as ConferenceWithCount[]) || [];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Conferences</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create, edit, and manage all your live ministry events and registration links.
          </p>
        </div>
        <Button asChild size="default" className="shadow-md hover:shadow-lg transition-all bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-semibold">
          <Link href="/dashboard/conferences/new">
            <PlusIcon className="w-4 h-4" />
            Create Conference
          </Link>
        </Button>
      </div>

      <Card className="border-border shadow-xs bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-card-foreground">All Conferences</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage live public pages, update event details, view registrations, and delete past conferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConferenceTableClient
            conferences={typedConferences}
            churchSlug={church.slug}
            churchId={church.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
