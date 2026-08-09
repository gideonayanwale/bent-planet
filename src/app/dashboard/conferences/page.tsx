import Link from "next/link";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon, ExternalLinkIcon, Share2Icon } from "lucide-react";

export default async function ConferencesPage() {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  
  const church = await getChurchByAdminEmail(adminClient, user.email!);
  
  if (!church) {
    return <div>Church not found</div>;
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900">Conferences</h1>
          <p className="text-slate-600 mt-1">Manage your events and view their performance.</p>
        </div>
        <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all">
          <Link href="/dashboard/conferences/new">
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Conference
          </Link>
        </Button>
      </div>

      <Card className="border-slate-200/70 shadow-sm">
        <CardHeader>
          <CardTitle>All Conferences</CardTitle>
          <CardDescription>A list of all your created conferences, both draft and published.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title & Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribers</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conferences && conferences.length > 0 ? (
                  conferences.map((conf: any) => (
                    <TableRow key={conf.id}>
                      <TableCell>
                        <p className="font-semibold text-slate-900">{conf.title}</p>
                        <p className="text-sm text-slate-500">
                          {conf.conference_date ? new Date(conf.conference_date).toLocaleDateString() : "No date"}
                          {" · "}
                          {conf.theme || "General"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            conf.status === "published" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }
                        >
                          {conf.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {conf.subscribers?.[0]?.count ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {conf.status === "published" && (
                          <>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/dashboard/conferences/${conf.id}/promote`}>
                                <Share2Icon className="w-4 h-4 mr-2" />
                                Promote
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                              <a href={`/c/${church.slug}/${conf.slug}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLinkIcon className="w-4 h-4" />
                              </a>
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <p className="text-slate-500">You haven't created any conferences yet.</p>
                        <Button asChild variant="outline">
                          <Link href="/dashboard/conferences/new">Create Your First Conference</Link>
                        </Button>
                      </div>
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
