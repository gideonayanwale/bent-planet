import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscriberTableClient } from "@/components/subscriber-table-client";
import type { Database } from "@/types/database";

type SubscriberWithConf = Database["public"]["Tables"]["subscribers"]["Row"] & {
  conferences?: { title?: string } | null;
};

export default async function SubscribersPage() {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  
  const church = await getChurchByAdminEmail(adminClient, user.email!);
  
  if (!church) {
    return <div>Church not found</div>;
  }

  const { data: subscribers, error } = await adminClient
    .from("subscribers")
    .select("id, full_name, email, phone, subscribed_at, conferences(title)")
    .eq("church_id", church.id)
    .order("subscribed_at", { ascending: false });

  if (error) {
    console.error("Failed to load subscribers", error);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Subscribers & Leads</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your ministry audience, export email lists, and add offline registrations.</p>
        </div>
        <Badge variant="outline" className="text-sm px-4 py-1.5 font-semibold bg-card shadow-xs border-border">
          Total Subscribers: {subscribers?.length || 0}
        </Badge>
      </div>

      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="text-card-foreground">Subscriber Roster</CardTitle>
          <CardDescription className="text-muted-foreground">All registered attendees who receive your conference updates and automated emails.</CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriberTableClient
            initialSubscribers={(subscribers as unknown as SubscriberWithConf[]) || []}
            churchId={church.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
