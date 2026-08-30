import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardNav } from "@/components/dashboard-nav";
import { OnboardingTourModal } from "@/components/onboarding-tour-modal";
import { stopImpersonatingAction } from "@/app/super-admin/actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  const church = await getChurchByAdminEmail(adminClient, user.email!);

  // @ts-ignore
  const isImpersonating = !!user.isImpersonating;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors flex flex-col">
      {isImpersonating && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-3">
          <span>⚠️ Support Mode: You are impersonating {church?.name || "Church Workspace"} ({user.email})</span>
          <form action={async () => {
            "use server";
            await stopImpersonatingAction();
            redirect("/super-admin");
          }}>
            <Button size="xs" variant="outline" className="bg-amber-600 hover:bg-amber-700 text-white border-0 font-bold px-3 py-1 h-auto text-[10px]">
              Stop Impersonating
            </Button>
          </form>
        </div>
      )}
      <DashboardNav
        churchName={church?.name}
        churchLogo={church?.logo_url}
        adminEmail={user.email}
      />
      <main className="container py-8 sm:py-10 px-4 sm:px-8 max-w-7xl mx-auto flex-1">
        {children}
      </main>

      {/* Onboarding Tour Modal: masks dashboard on first login until completed */}
      <OnboardingTourModal
        churchName={church?.name}
        initialCompleted={Boolean(church?.onboarding_tour_completed)}
      />
    </div>
  );
}
