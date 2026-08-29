import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  const church = await getChurchByAdminEmail(adminClient, user.email!);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <DashboardNav
        churchName={church?.name}
        churchLogo={church?.logo_url}
        adminEmail={user.email}
      />
      <main className="container py-8 sm:py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
