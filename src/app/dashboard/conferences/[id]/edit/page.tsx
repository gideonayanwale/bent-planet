import { notFound } from "next/navigation";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { getConferenceById } from "@/lib/conferences";
import { createAdminClient } from "@/lib/supabase/admin";
import { EditConferenceForm } from "./edit-form";

export default async function EditConferencePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireChurchUser();
  const adminClient = createAdminClient();
  const church = await getChurchByAdminEmail(adminClient, user.email!);

  if (!church) {
    return <div className="p-8 text-center text-slate-600">Church workspace not found.</div>;
  }

  const conference = await getConferenceById(adminClient, params.id);

  if (!conference || conference.church_id !== church.id) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <EditConferenceForm
        conference={conference}
        churchSlug={church.slug}
        churchName={church.name}
      />
    </div>
  );
}
