import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsForm } from "./settings-form";

export default async function ChurchSettingsPage() {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  const church = await getChurchByAdminEmail(adminClient, user.email!);

  if (!church) {
    return <div className="p-8 text-center text-slate-600">Church workspace not found.</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Workspace Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Customize your church branding (logo & cover banner), mission statement, and social channels.
        </p>
      </div>

      <SettingsForm church={church} />
    </div>
  );
}
