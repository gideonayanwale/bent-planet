import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireChurchUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { isSuperAdmin as checkIsSuperAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/notifications — fetch for current church (or all for super admin)
export async function GET() {
  try {
    const user = await requireChurchUser();
    const adminClient = createAdminClient();

    const isSuperAdmin = checkIsSuperAdmin(user.email);

    let query = adminClient
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!isSuperAdmin) {
      const church = await getChurchByAdminEmail(adminClient, user.email!);
      if (!church) return NextResponse.json({ notifications: [] });
      query = query.eq("church_id", church.id);
    } else {
      // Super admin sees notifications where church_id IS NULL (platform-level alerts)
      query = query.is("church_id", null);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json({ notifications: data || [] });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/notifications — mark notification(s) as read
export async function PATCH(request: Request) {
  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "ids array required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("notifications")
      .update({ read: true } as any)
      .in("id", ids);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
