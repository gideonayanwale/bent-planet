import { requireSuperAdminUser } from "@/lib/current-user";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireSuperAdminUser();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <DashboardNav adminEmail={user.email} isSuperAdmin={true} />
      <main className="container py-8 sm:py-10 px-4 sm:px-8 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
