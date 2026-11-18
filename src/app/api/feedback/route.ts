import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/current-user";
import { getChurchByAdminEmail } from "@/lib/churches";
import { isSuperAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const feedbackSchema = z.object({
  email: z.string().trim().email().max(254).optional(),
  name: z.string().trim().max(120).optional().nullable(),
  category: z.enum(["feedback", "support", "feature_request"]).optional(),
  message: z.string().trim().min(10).max(5000),
  churchId: z.string().uuid().optional().nullable(),
  church_id: z.string().uuid().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ error: "Sign in to submit feedback." }, { status: 401 });
    }

    const parsed = feedbackSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please provide a valid feedback message." }, { status: 400 });
    }

    const { name, category, message, churchId, church_id } = parsed.data;
    const superAdmin = isSuperAdmin(user.email);
    let targetChurchId: string | null = null;

    if (superAdmin) {
      targetChurchId = churchId || church_id || null;
    } else {
      const adminClient = createAdminClient();
      const church = await getChurchByAdminEmail(adminClient, user.email);
      if (!church) {
        return NextResponse.json({ error: "Church workspace not found." }, { status: 403 });
      }
      const requestedChurchId = churchId || church_id;
      if (requestedChurchId && requestedChurchId !== church.id) {
        return NextResponse.json({ error: "You cannot submit feedback for another church." }, { status: 403 });
      }
      targetChurchId = church.id;
    }

    const adminClient = createAdminClient();
    const { error: insertError } = await adminClient.from("feedback_messages").insert({
      church_id: targetChurchId,
      user_email: user.email,
      user_name: name || null,
      category: category || "feedback",
      message,
      status: "unread",
    });

    if (insertError) {
      console.error("Feedback insert error:", insertError);
      return NextResponse.json({ error: "Failed to submit feedback." }, { status: 500 });
    }

    const { error: notificationError } = await adminClient.from("notifications").insert({
      church_id: targetChurchId,
      type: "feedback",
      title: "New Feedback (" + (category || "General") + ")",
      message: (name ? name + " (" + user.email + ")" : user.email) + ": " + message.slice(0, 80) + (message.length > 80 ? "..." : ""),
      action_url: targetChurchId ? "/dashboard" : "/super-admin",
      read: false,
    });
    if (notificationError) console.error("Feedback notification error:", notificationError);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Feedback API error:", error);
    return NextResponse.json({ error: "Failed to submit feedback." }, { status: 500 });
  }
}
