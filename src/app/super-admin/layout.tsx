import Link from "next/link";

import { signOutAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireSuperAdminUser } from "@/lib/current-user";

export default async function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireSuperAdminUser();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="container flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Badge className="bg-highlight/15 text-highlight hover:bg-highlight/15">
              Super admin
            </Badge>
            <div>
              <p className="font-heading text-2xl font-semibold text-primary">Bent Planet control room</p>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/super-admin">Overview</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/super-admin/invite">Invite a church</Link>
            </Button>
            <form action={signOutAction}>
              <Button variant="outline" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container py-10">{children}</main>
    </div>
  );
}
