import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { isSuperAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getNotificationScope() {
  const user = await getCurrentUser();
  if (!user?.email) return { error: "Unauthorized", status: 401 as const };

  if (isSuperAdmin(user.email)) {
    return { user, isSuperAdmin: true, churchId: null as string | null };
  }

  const adminClient = createAdminClient();
  const church = await getChurchByAdminEmail(adminClient, user.email);
  if (!church) return { error: "Church workspace not found.", status: 403 as const };

  return { user, isSuperAdmin: false, churchId: church.id };
}

// GET /api/notifications — return only the caller's notification scope.
export async function GET() {
  try {
    const scope = await getNotificationScope();
    if ("error" in scope) {
      return NextResponse.json({ error: scope.error }, { status: scope.status });
    }

    const adminClient = createAdminClient();
    let query = adminClient
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    query = scope.isSuperAdmin
      ? query.is("church_id", null)
      : query.eq("church_id", scope.churchId!);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json({ notifications: data || [] });
  } catch (error: unknown) {
    console.error("Notifications GET error:", error);
    return NextResponse.json({ error: "Unable to load notifications." }, { status: 500 });
  }
}

// PATCH /api/notifications — mark only notifications in the caller's scope as read.
export async function PATCH(request: Request) {
  try {
    const scope = await getNotificationScope();
    if ("error" in scope) {
      return NextResponse.json({ error: scope.error }, { status: scope.status });
    }

    const body = await request.json();
    const ids = body?.ids;
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      ids.length > 50 ||
      !ids.every((id: unknown) => typeof id === "string" && UUID_PATTERN.test(id))
    ) {
      return NextResponse.json({ error: "Provide between 1 and 50 valid notification IDs." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    let query = adminClient
      .from("notifications")
      .update({ read: true } as any)
      .in("id", ids);

    query = scope.isSuperAdmin
      ? query.is("church_id", null)
      : query.eq("church_id", scope.churchId!);

    const { error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Notifications PATCH error:", error);
    return NextResponse.json({ error: "Unable to update notifications." }, { status: 500 });
  }
}
