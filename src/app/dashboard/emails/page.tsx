import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BroadcastEmailComposer } from "@/components/broadcast-email-composer";
import type { Database } from "@/types/database";

type EmailLogRow = Database["public"]["Tables"]["email_log"]["Row"] & {
  subscribers?: { full_name?: string; email?: string } | null;
};

export default async function EmailsPage() {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  
  const church = await getChurchByAdminEmail(adminClient, user.email!);
  
  if (!church) {
    return <div>Church not found</div>;
  }

  const [emailsRes, subscribersCountRes] = await Promise.all([
    adminClient
      .from("email_log")
      .select("*, subscribers(full_name, email)")
      .eq("church_id", church.id)
      .order("sent_at", { ascending: false }),
    adminClient
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("church_id", church.id)
      .eq("unsubscribed", false),
  ]);

  const emails = (emailsRes.data as unknown as EmailLogRow[]) || [];
  const subscriberCount = subscribersCountRes.count || 0;

  const totalOpened = emails.filter((e) => e.opened).length;
  const openRate = emails.length > 0 ? Math.round((totalOpened / emails.length) * 100) : 100;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Email Center & Communication</h1>
        <p className="text-muted-foreground mt-1 text-sm">Send broadcast announcements to your subscribers and view delivery analytics.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Emails Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-heading text-foreground">{emails.length}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subscriber List Size</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-heading text-foreground">{subscriberCount}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-heading text-foreground">{openRate}%</p>
            <p className="text-xs text-primary mt-1 font-medium">Welcome & Announcement Sequences</p>
          </CardContent>
        </Card>
      </div>

      {/* Broadcast Composer */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="text-card-foreground">Send Email Broadcast</CardTitle>
          <CardDescription className="text-muted-foreground">Compose and dispatch an instant announcement email to all your church subscribers.</CardDescription>
        </CardHeader>
        <CardContent>
          <BroadcastEmailComposer
            churchName={church.name}
            subscriberCount={subscriberCount}
          />
        </CardContent>
      </Card>

      {/* Email Delivery Log Table */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <CardTitle className="text-card-foreground">Email Delivery Log</CardTitle>
          <CardDescription className="text-muted-foreground">Comprehensive history of all welcome emails, reminders, and broadcasts sent from your workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Email Type</TableHead>
                  <TableHead>Delivery Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.length > 0 ? (
                  emails.map((emailLog) => (
                    <TableRow key={emailLog.id} className="hover:bg-secondary/40">
                      <TableCell>
                        <p className="font-semibold text-foreground text-sm">{emailLog.subscribers?.full_name || "Subscriber"}</p>
                        <p className="text-xs text-muted-foreground font-mono">{emailLog.subscribers?.email || "—"}</p>
                      </TableCell>
                      <TableCell className="max-w-[280px] truncate text-foreground text-sm font-medium">
                        {emailLog.subject || "No Subject"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-xs font-normal bg-secondary text-foreground">
                          {emailLog.email_type.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {emailLog.opened ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 font-normal text-xs">
                            Opened
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="font-normal text-xs text-muted-foreground">
                            Delivered
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {emailLog.sent_at
                          ? new Date(emailLog.sent_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      No emails logged yet. Automated welcome emails will log here when subscribers sign up!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
